import type {
  Composition,
  StaveInfo,
  SliderContext,
  SliderMovementInfo,
} from './models';
import { MusicActionType } from './models';
import { FrequencyService } from './frequency-service';
import { PlaySoundService } from './play-sound-service';
import { MusicPositionService, START_LEFT_OFFSET, START_TOP_OFFSET, SLIDER_NORMALIZATION, VERTICAL_TACT_MARGIN } from './music-position-service';

export type PlaybackState = 'stopped' | 'playing' | 'paused';

export interface MusicPlayerEvents {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onNote?: (frequencies: number[], tact: number, note: number) => void;
  onTick?: (position: { tact: number; note: number; time: number }) => void;
  onEnd?: () => void;
  onProgress?: (progress: { tactIndex: number; noteIndex: number; fraction: number }) => void;
}

export class MusicPlayer {
  private composition: Composition | null = null;
  private staveContexts: Map<number, SliderContext> = new Map();
  private playSoundService: PlaySoundService;
  private frequencyService: FrequencyService;
  private musicPositionService: MusicPositionService;

  private playing = false;
  private paused = false;

  private events: MusicPlayerEvents = {};

  constructor() {
    this.playSoundService = new PlaySoundService();
    this.frequencyService = new FrequencyService();
    this.musicPositionService = new MusicPositionService();
  }

  setEvents(events: MusicPlayerEvents): void {
    this.events = events;
  }

  loadComposition(composition: Composition): void {
    this.composition = composition;
    this.staveContexts.clear();

    composition.staves.forEach((_stave, index) => {
      this.staveContexts.set(index, this.createSliderContext());
    });
  }

  private createSliderContext(): SliderContext {
    return {
      top: START_TOP_OFFSET,
      left: START_LEFT_OFFSET,
      currentInterval: 0,
      playIntervals: [],
      intervals: [],
      timeouts: []
    };
  }

  getPlaybackState(): PlaybackState {
    if (this.playing) return 'paused';
    if (this.playing && !this.paused) return 'playing';
    return 'stopped';
  }

  isPlaying(): boolean {
    return this.playing;
  }

  isPaused(): boolean {
    return this.paused;
  }

  handleAction(action: MusicActionType): void {
    switch (action) {
      case MusicActionType.PLAY:
        this.play();
        break;
      case MusicActionType.CONTINUE:
        this.continue();
        break;
      case MusicActionType.STOP:
        this.stop();
        break;
      case MusicActionType.SUSPEND:
        this.suspend();
        break;
    }
  }

  private play(): void {
    if (!this.composition) return;

    this.playSoundService.clear();
    this.clearTimeouts();

    this.composition.staves.forEach((stave, index) => {
      const context = this.staveContexts.get(index) || this.createSliderContext();
      context.left = START_LEFT_OFFSET;
      context.top = START_TOP_OFFSET;
      context.playIntervals = this.musicPositionService.calculateTime(stave.tacts, this.composition!.bpm);
      context.currentInterval = 0;
      this.staveContexts.set(index, context);
    });

    this.playing = true;
    this.paused = false;
    this.events.onPlay?.();

    this.composition.staves.forEach((stave, index) => {
      this.playStave(stave, index);
    });
  }

  private continue(): void {
    if (!this.composition || !this.playing) return;

    this.paused = false;
    this.events.onPlay?.();

    this.composition.staves.forEach((stave, index) => {
      const context = this.staveContexts.get(index);
      if (context) {
        context.currentInterval++;
        this.playStave(stave, index);
      }
    });
  }

  private suspend(): void {
    this.paused = true;
    this.playing = false;
    this.clearTimeoutsOnly();
    this.events.onPause?.();
  }

  private stop(): void {
    this.playing = false;
    this.paused = false;
    this.clearTimeouts();

    this.staveContexts.forEach(context => {
      context.left = START_LEFT_OFFSET;
      context.top = START_TOP_OFFSET;
      context.currentInterval = 0;
      context.playIntervals = [];
    });

    this.events.onStop?.();
  }

  private playStave(stave: StaveInfo, staveIndex: number): void {
    const context = this.staveContexts.get(staveIndex);
    if (!context) return;

    let sliderDelay = 0;

    for (let i = context.currentInterval; i < context.playIntervals.length; i++) {
      const timeout = setTimeout((intervalIndex: number) => {
        context.currentInterval = intervalIndex;
        const interval = context.playIntervals[intervalIndex];
        
        const frequencies = this.getNoteFrequencies(interval, stave);
        if (frequencies.length > 0) {
          this.playSoundService.playSound(frequencies);
          this.events.onNote?.(frequencies, interval.tact || 0, interval.note || 0);
        }

        this.events.onTick?.({
          tact: interval.tact || 0,
          note: interval.note || 0,
          time: interval.time
        });

        let times = Math.floor(interval.time);
        const fractional = interval.time % 1;
        const totalSteps = Math.floor(interval.time);
        let elapsedSteps = 0;

        const moveInterval = setInterval((speed: number, isEndOfTact: boolean) => {
          context.left += speed;
          times--;
          elapsedSteps++;

          const fraction = totalSteps > 0 ? elapsedSteps / totalSteps : 1;
          
          this.events.onProgress?.({
            tactIndex: interval.tact || 0,
            noteIndex: interval.note || 0,
            fraction: Math.min(1, Math.max(0, fraction))
          });

          if (times <= 0) {
            context.left += fractional * speed;
            this.handleJump(context, intervalIndex);
            
            if (context.currentInterval === context.playIntervals.length - 1) {
              this.playing = false;
              this.events.onEnd?.();
            }

            if (isEndOfTact) {
              context.left += SLIDER_NORMALIZATION;
            }

            clearInterval(moveInterval);
          }
        }, 10, interval.speed, interval.endOfTact);

        context.intervals.push(moveInterval);
      }, sliderDelay, i);

      context.timeouts.push(timeout);
      sliderDelay += context.playIntervals[i].time * 10;
    }
  }

  private getNoteFrequencies(movement: SliderMovementInfo, stave: StaveInfo): number[] {
    if (movement.tact == null || movement.note == null) {
      return [];
    }

    const notes = stave.tacts[movement.tact]?.notes[movement.note];
    if (!notes) return [];

    return notes
      .map((note, stringIndex) => {
        if (!note.value) return null;
        return this.frequencyService.calculateFrequency(stringIndex, +note.value);
      })
      .filter((freq): freq is number => freq !== null);
  }

  private handleJump(context: SliderContext, index: number): void {
    const interval = context.playIntervals[index];
    if (interval.jumpBelow) {
      context.left = START_LEFT_OFFSET;
      context.top += (interval.jumpHeight || 0) + VERTICAL_TACT_MARGIN;
    }
  }

  private clearTimeouts(): void {
    this.staveContexts.forEach(context => {
      context.timeouts.forEach(t => clearTimeout(t));
      context.intervals.forEach(i => clearInterval(i));
      context.timeouts = [];
      context.intervals = [];
    });
  }

  private clearTimeoutsOnly(): void {
    this.staveContexts.forEach(context => {
      context.timeouts.forEach(t => clearTimeout(t));
      context.timeouts = [];
    });
  }

  getCurrentPosition(): { stave: number; left: number; top: number }[] {
    const positions: { stave: number; left: number; top: number }[] = [];
    this.staveContexts.forEach((context, index) => {
      positions.push({ stave: index, left: context.left, top: context.top });
    });
    return positions;
  }

  destroy(): void {
    this.stop();
    this.composition = null;
    this.staveContexts.clear();
  }
}
