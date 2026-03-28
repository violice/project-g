import {
  type Composition,
  type StaveInfo,
  type TactInfo,
  type NoteDto,
  NoteDuration,
} from "../music-player";
import type { TabState, TabOptions } from "./types";

const STRING_SPACING = 24;
const NOTE_WIDTH = 40;
const TACT_PADDING = 20;
const STAVE_GAP = 60;
const STRING_COUNT = 6;
const DEFAULT_STRINGS = ["e", "B", "G", "D", "A", "E"];

const COLORS = {
  background: "#f8fafc",
  strings: "#cbd5e1",
  tactBar: "#6366f1",
  noteDefault: "#1e293b",
  noteActive: "#f59e0b",
  noteCorrect: "#10b981",
  text: "#64748b",
  highlight: "rgba(99, 102, 241, 0.1)",
  correctHighlight: "rgba(16, 185, 129, 0.1)",
  playhead: "#10b981",
};

export interface PlayheadProgress {
  tactIndex: number;
  noteIndex: number;
  fraction: number;
}

export class TabRenderer {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private composition: Composition | null = null;
  private state: TabState = { currentTact: 0, currentNote: 0, columnIndex: 0 };
  private options: Required<TabOptions>;
  private playheadProgress: PlayheadProgress | null = null;
  private tactYPositions: Map<number, number> = new Map();

  constructor(container: HTMLElement, options: TabOptions = {}) {
    this.container = container;
    this.options = {
      stringNames: options.stringNames ?? DEFAULT_STRINGS,
      showTactNumbers: options.showTactNumbers ?? true,
    };

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.ctx = this.canvas.getContext("2d")!;
    container.appendChild(this.canvas);

    this.handleResize();
    window.addEventListener("resize", () => this.handleResize());
  }

  private handleResize(): void {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = this.calculateHeight();
    this.tactYPositions.clear();
    this.draw();
  }

  private scrollToPlayhead(x: number, y: number): void {
    const containerRect = this.container.getBoundingClientRect();
    const margin = 80;

    if (x > containerRect.width - margin || x < margin) {
      const newScroll = Math.max(0, x - containerRect.width / 2);
      this.container.scrollLeft = newScroll;
    }

    const stringSpacing = 24;
    const stringY = y + 3 * stringSpacing;

    if (stringY > 0) {
      const containerHeight = containerRect.height;
      const scrollTop = this.container.parentElement?.scrollTop ?? 0;
      if (stringY > scrollTop + containerHeight - margin || stringY < scrollTop + margin) {
        this.container.parentElement?.scrollTo({
          top: Math.max(0, stringY - containerHeight / 2),
          behavior: "smooth",
        });
      }
    }
  }

  private calculateHeight(): number {
    if (!this.composition) return 150;

    let height = 60;
    for (const stave of this.composition.staves) {
      const rowCount = Math.ceil(stave.tacts.length / this.getTactsPerRow());
      height += rowCount * (STRING_COUNT * STRING_SPACING + 40) + STAVE_GAP;
    }
    return Math.max(150, height);
  }

  private getTactsPerRow(): number {
    const availableWidth = this.canvas.width - 100;
    return Math.max(1, Math.floor(availableWidth / (NOTE_WIDTH * 8 + TACT_PADDING * 2)));
  }

  private draw(): void {
    const { width, height } = this.canvas;

    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, width, height);

    if (!this.composition) return;

    this.tactYPositions.clear();
    let y = 40;
    for (let staveIdx = 0; staveIdx < this.composition.staves.length; staveIdx++) {
      const stave = this.composition.staves[staveIdx];
      y = this.drawStave(stave, staveIdx, 30, y);
      y += STAVE_GAP;
    }
  }

  private drawStave(stave: StaveInfo, _staveIdx: number, x: number, startY: number): number {
    const ctx = this.ctx;
    let currentX = x;
    let currentY = startY;
    let tactInRow = 0;
    let globalColOffset = 0;

    for (let tactIdx = 0; tactIdx < stave.tacts.length; tactIdx++) {
      const tact = stave.tacts[tactIdx];
      const tactWidth = this.calculateTactWidth(tact);

      if (tactInRow > 0 && currentX + tactWidth > this.canvas.width - 20) {
        currentY += STRING_COUNT * STRING_SPACING + 40;
        currentX = x;
        tactInRow = 0;
      }

      if (this.options.showTactNumbers) {
        ctx.font = "12px Arial";
        ctx.fillStyle = COLORS.text;
        ctx.fillText(`${tact.serialNumber + 1}`, currentX, currentY - 35);
      }

      this.tactYPositions.set(tact.serialNumber, currentY);
      this.drawTact(tact, currentX, currentY, globalColOffset);
      globalColOffset += tact.notes.length;

      currentX += tactWidth + TACT_PADDING;
      tactInRow++;
    }

    return currentY + STRING_COUNT * STRING_SPACING + 20;
  }

  private calculateTactWidth(tact: TactInfo): number {
    return tact.notes.length * NOTE_WIDTH + TACT_PADDING * 2;
  }

  private drawTact(tact: TactInfo, x: number, y: number, globalColOffset: number): void {
    const ctx = this.ctx;
    const tactWidth = this.calculateTactWidth(tact);

    ctx.strokeStyle = COLORS.tactBar;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + (STRING_COUNT - 1) * STRING_SPACING);
    ctx.stroke();

    this.drawStrings(x, y, tactWidth);

    const noteX = x + TACT_PADDING;
    for (let colIdx = 0; colIdx < tact.notes.length; colIdx++) {
      const column = tact.notes[colIdx];
      this.drawColumn(column, noteX + colIdx * NOTE_WIDTH, y);
    }

    this.drawDurations(tact, x, y);

    ctx.strokeStyle = COLORS.tactBar;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + tactWidth, y);
    ctx.lineTo(x + tactWidth, y + (STRING_COUNT - 1) * STRING_SPACING);
    ctx.stroke();

    const noteColumnIndex = this.state.columnIndex - globalColOffset;
    if (noteColumnIndex >= 0 && noteColumnIndex < tact.notes.length) {
      const playheadX = this.calculatePlayheadX(tact, x, noteColumnIndex);
      this.drawPlayhead(playheadX, y);
      this.scrollToPlayhead(playheadX, y);
    }
  }

  private calculatePlayheadX(tact: TactInfo, tactX: number, noteColumnIndex: number): number {
    const noteX = tactX + TACT_PADDING;
    const baseX = noteX + noteColumnIndex * NOTE_WIDTH;

    if (
      this.playheadProgress &&
      this.playheadProgress.tactIndex === tact.serialNumber &&
      this.playheadProgress.noteIndex === noteColumnIndex
    ) {
      const fraction = this.playheadProgress.fraction;
      return baseX + NOTE_WIDTH * fraction;
    }

    return baseX;
  }

  private drawPlayhead(x: number, y: number): void {
    const ctx = this.ctx;
    const height = (STRING_COUNT - 1) * STRING_SPACING;

    ctx.strokeStyle = COLORS.playhead;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.stroke();

    ctx.fillStyle = COLORS.playhead;
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 5);
    ctx.lineTo(x + 6, y - 5);
    ctx.lineTo(x, y + 5);
    ctx.closePath();
    ctx.fill();
  }

  private drawStrings(x: number, y: number, width: number): void {
    const ctx = this.ctx;
    ctx.strokeStyle = COLORS.strings;
    ctx.lineWidth = 1;

    ctx.font = "bold 11px monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = COLORS.text;

    for (let i = 0; i < STRING_COUNT; i++) {
      const stringY = y + i * STRING_SPACING;
      ctx.fillText(this.options.stringNames[i], x - 8, stringY);
      ctx.beginPath();
      ctx.moveTo(x, stringY);
      ctx.lineTo(x + width, stringY);
      ctx.stroke();
    }
  }

  private drawColumn(column: NoteDto[], x: number, startY: number): void {
    const ctx = this.ctx;

    for (let stringIdx = 0; stringIdx < STRING_COUNT; stringIdx++) {
      const note = column[stringIdx];
      const noteY = startY + stringIdx * STRING_SPACING;

      if (note && note.value) {
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const noteKey = `${this.state.columnIndex}-${stringIdx}`;
        if (this.state.correctNotes?.has(noteKey)) {
          ctx.fillStyle = COLORS.correctHighlight;
          ctx.fillRect(x + 2, noteY - 12, NOTE_WIDTH - 4, 20);
          ctx.fillStyle = COLORS.noteCorrect;
        } else {
          ctx.fillStyle = COLORS.noteDefault;
        }

        ctx.fillText(note.value, x + NOTE_WIDTH / 2, noteY);
      }
    }
  }

  private reverseDuration(duration: number) {
    const durationsMap = {
      1: NoteDuration.SEMIBREVE,
      2: NoteDuration.HALF,
      4: NoteDuration.EIGHTH,
      8: NoteDuration.SIXTEENTH,
      16: NoteDuration.THIRTY_TWO,
      32: NoteDuration.SIXTY_FOUR,
    };
    return durationsMap[duration as keyof typeof durationsMap];
  }
  //   export enum NoteDuration {
  //   SIXTY_FOUR = 1,
  //   THIRTY_TWO = 2,
  //   SIXTEENTH = 4,
  //   EIGHTH = 8,
  //   HALF = 16,
  //   SEMIBREVE = 32
  // }

  private drawDurations(tact: TactInfo, x: number, y: number): void {
    const ctx = this.ctx;
    const lastStringY = y + (STRING_COUNT - 1) * STRING_SPACING;
    const durationY = lastStringY + 18;

    ctx.font = "10px Arial";
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let colIdx = 0; colIdx < tact.notes.length; colIdx++) {
      const column = tact.notes[colIdx];
      const noteX = x + TACT_PADDING + colIdx * NOTE_WIDTH + NOTE_WIDTH / 2;
      const duration = column.find(n => n && n.value)?.duration ?? column[0]?.duration ?? 4;
      ctx.fillText(String(this.reverseDuration(duration)), noteX, durationY);
    }
  }

  render(composition: Composition): void {
    this.composition = composition;
    this.handleResize();
  }

  updateState(state: Partial<TabState>): void {
    this.state = { ...this.state, ...state };
    this.draw();
  }

  updatePlayheadProgress(progress: PlayheadProgress): void {
    this.playheadProgress = progress;

    if (this.composition) {
      let columnIndex = 0;
      let found = false;
      for (const stave of this.composition.staves) {
        for (const tact of stave.tacts) {
          if (tact.serialNumber === progress.tactIndex) {
            columnIndex += progress.noteIndex;
            found = true;
            break;
          }
          columnIndex += tact.notes.length;
        }
        if (found) break;
      }
      this.state = {
        ...this.state,
        currentTact: progress.tactIndex,
        currentNote: progress.noteIndex,
        columnIndex,
      };
    }

    this.draw();
  }

  resetPlayhead(): void {
    this.playheadProgress = null;
    this.state = { currentTact: 0, currentNote: 0, columnIndex: 0 };
    this.draw();
  }

  updateCorrectNotes(correctNotes: Set<string>): void {
    this.state = { ...this.state, correctNotes };
    this.draw();
  }

  destroy(): void {
    window.removeEventListener("resize", this.handleResize);
    this.canvas.remove();
  }
}
