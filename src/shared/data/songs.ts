import type { Composition } from "../lib/music-player";
import { NoteFunctionType, NoteDuration } from "../lib/music-player";
import songJson from "./SONG.json";
import song2Json from "./SONG_2.json";
import { jsonToComposition } from "./json-converter";

export interface Song {
  name: string;
  description: string;
  bpm: number;
  composition: Composition;
}

const createLine = (
  value: string,
  duration: number,
  func: NoteFunctionType = NoteFunctionType.DEFAULT,
) => ({
  value,
  duration,
  functionType: func,
});

const emptyLine = (duration: number) => {
  return createLine("", duration, NoteFunctionType.DEFAULT);
};

const createColumn = (index: number, value: string, duration: number) => {
  const column = Array(6).fill(emptyLine(duration));
  column[index] = createLine(value, duration);
  return column;
};

export const songs: Song[] = [
  {
    name: "Imported from JSON",
    description: "Imported from SONG.json",
    bpm: 120,
    composition: jsonToComposition(songJson as any, "Imported from JSON", 120),
  },
  {
    name: "Imported from JSON 2",
    description: "Imported from SONG_2.json",
    bpm: 120,
    composition: jsonToComposition(song2Json as any, "Imported from JSON 2", 120),
  },
  {
    name: "Test",
    description: "",
    bpm: 120,
    composition: {
      name: "Test",
      bpm: 120,
      complexity: 3,
      description: "",
      videoLink: "",
      staves: [
        {
          instrument: "GUITAR",
          tacts: [
            {
              sizeStr: "4/4",
              serialNumber: 0,
              notes: [
                createColumn(3, "3", NoteDuration.HALF),
                createColumn(3, "5", NoteDuration.SIXTEENTH),
                createColumn(1, "3", NoteDuration.SIXTEENTH),
                createColumn(2, "1", NoteDuration.SIXTEENTH),
                createColumn(3, "3", NoteDuration.EIGHTH),
                createColumn(4, "5", NoteDuration.EIGHTH),
              ],
            },
            {
              sizeStr: "4/4",
              serialNumber: 1,
              notes: [
                createColumn(3, "3", NoteDuration.HALF),
                createColumn(3, "5", NoteDuration.SIXTEENTH),
                createColumn(1, "3", NoteDuration.SIXTEENTH),
                createColumn(2, "1", NoteDuration.SIXTEENTH),
                createColumn(3, "3", NoteDuration.EIGHTH),
                createColumn(4, "5", NoteDuration.SEMIBREVE),
              ],
            },
            {
              sizeStr: "4/4",
              serialNumber: 2,
              notes: [
                createColumn(3, "3", NoteDuration.HALF),
                createColumn(3, "5", NoteDuration.SIXTEENTH),
                createColumn(1, "3", NoteDuration.SIXTEENTH),
                createColumn(2, "1", NoteDuration.SIXTEENTH),
                createColumn(3, "3", NoteDuration.EIGHTH),
                createColumn(4, "5", NoteDuration.SEMIBREVE),
              ],
            },
            {
              sizeStr: "4/4",
              serialNumber: 3,
              notes: [
                createColumn(3, "3", NoteDuration.HALF),
                createColumn(3, "5", NoteDuration.SIXTEENTH),
                createColumn(1, "3", NoteDuration.SIXTEENTH),
                createColumn(2, "1", NoteDuration.SIXTEENTH),
                createColumn(3, "3", NoteDuration.EIGHTH),
                createColumn(4, "5", NoteDuration.SEMIBREVE),
              ],
            },
          ],
        },
      ],
    },
  },
];
