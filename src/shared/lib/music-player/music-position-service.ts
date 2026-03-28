import { type TactInfo, type SliderMovementInfo } from "./models";

export const VERTICAL_TACT_MARGIN = 120;
export const NOTE_LENGTH = 32;
export const START_TACT_LENGTH = 100;
export const TACTS_WIDTH = 880;
export const SLIDER_NORMALIZATION = 5;
export const START_LEFT_OFFSET = 0;
export const START_TOP_OFFSET = 133;

export class MusicPositionService {
  calculateTime(tacts: TactInfo[], bpm: number): SliderMovementInfo[] {
    const movements: SliderMovementInfo[] = [];
    const entireNote = 60000 / bpm / 4;

    for (let i = 0; i < tacts.length; i++) {
      if (i === 0 || tacts[i].sizeStr !== tacts[i - 1].sizeStr) {
        movements.push({ speed: START_TACT_LENGTH, time: 0 });
      }

      tacts[i].notes.forEach((noteColumn, index) => {
        const time = (noteColumn[0].duration / 32.0) * entireNote;
        const speed = NOTE_LENGTH / time;
        const jumpBelow =
          i + 1 < tacts.length &&
          index + 1 === tacts[i].notes.length &&
          tacts[i].topLeftCorner !== tacts[i + 1].topLeftCorner;
        const endOfTact = index + 1 === tacts[i].notes.length;

        movements.push({
          speed,
          time,
          tact: tacts[i].serialNumber,
          note: index,
          jumpBelow,
          jumpHeight: tacts[i].height,
          endOfTact,
        });
      });
    }

    return movements;
  }
}
