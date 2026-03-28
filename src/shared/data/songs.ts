import type { Composition } from "../lib/music-player";
import { NoteFunctionType, NoteDuration } from "../lib/music-player";
import { jsonToComposition } from "./json-converter";
import json from './SNA.json';

const createLine = (
  value: string,
  duration: number,
  func: NoteFunctionType = NoteFunctionType.DEFAULT,
) => ({
  value,
  duration,
  functionType: func,
});

const emptyLine = (duration: number) => createLine("", duration, NoteFunctionType.DEFAULT);

const createColumn = (index: number, value: string, duration: number) => {
  const column = Array(6).fill(emptyLine(duration));
  column[index] = createLine(value, duration);
  return column;
};

const makeTact = (notes: ReturnType<typeof createColumn>[], serialNumber: number) => ({
  sizeStr: "4/4",
  serialNumber,
  notes,
});

const makeStave = (tacts: ReturnType<typeof makeTact>[]) => ({
  instrument: "GUITAR" as const,
  tacts,
});

export interface Song {
  name: string;
  description: string;
  bpm: number;
  composition: Composition;
}

const makeSong = (
  name: string,
  description: string,
  bpm: number,
  tacts: ReturnType<typeof makeTact>[],
): Song => ({
  name,
  description,
  bpm,
  composition: {
    name,
    bpm,
    complexity: 2,
    description: "",
    videoLink: "",
    staves: [makeStave(tacts)],
  },
});

const composition = jsonToComposition(json, "SNA", 60);

export const songs: Song[] = [
  {
    bpm: 60,
    name: "Seven Nation Army",
    description: "The White Stripe",
    composition,
  },
  makeSong("Smoke on the Water", "Deep Purple — культовый рифф", 120, [
    makeTact(
      [
        createColumn(5, "3", NoteDuration.SIXTEENTH),
        createColumn(4, "1", NoteDuration.SIXTEENTH),
        createColumn(3, "1", NoteDuration.SIXTEENTH),
        createColumn(5, "3", NoteDuration.SIXTEENTH),
        createColumn(4, "1", NoteDuration.SIXTEENTH),
        createColumn(3, "1", NoteDuration.SIXTEENTH),
        createColumn(5, "3", NoteDuration.SIXTEENTH),
        createColumn(4, "1", NoteDuration.SIXTEENTH),
      ],
      0,
    ),
    makeTact(
      [
        createColumn(3, "1", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
      ],
      1,
    ),
    makeTact(
      [
        createColumn(5, "3", NoteDuration.SIXTEENTH),
        createColumn(4, "1", NoteDuration.SIXTEENTH),
        createColumn(3, "1", NoteDuration.SIXTEENTH),
        createColumn(5, "3", NoteDuration.SIXTEENTH),
        createColumn(4, "1", NoteDuration.SIXTEENTH),
        createColumn(3, "1", NoteDuration.SIXTEENTH),
        createColumn(5, "3", NoteDuration.SIXTEENTH),
        createColumn(4, "1", NoteDuration.SIXTEENTH),
      ],
      2,
    ),
    makeTact(
      [
        createColumn(3, "1", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
        createColumn(5, "5", NoteDuration.SIXTEENTH),
      ],
      3,
    ),
  ]),
  makeSong("C Major Scale", "Простая гамма для разминки", 80, [
    makeTact(
      [
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(4, "3", NoteDuration.EIGHTH),
        createColumn(4, "5", NoteDuration.EIGHTH),
        createColumn(4, "6", NoteDuration.EIGHTH),
        createColumn(4, "5", NoteDuration.EIGHTH),
        createColumn(4, "3", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
      ],
      0,
    ),
    makeTact(
      [
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(3, "3", NoteDuration.EIGHTH),
        createColumn(3, "4", NoteDuration.EIGHTH),
        createColumn(3, "5", NoteDuration.EIGHTH),
        createColumn(3, "4", NoteDuration.EIGHTH),
        createColumn(3, "3", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
      ],
      1,
    ),
  ]),
  makeSong("E Power Chord", "Power chord — основа рока", 100, [
    makeTact(
      [
        createColumn(5, "0", NoteDuration.EIGHTH),
        createColumn(5, "0", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(5, "0", NoteDuration.EIGHTH),
        createColumn(5, "0", NoteDuration.EIGHTH),
      ],
      0,
    ),
    makeTact(
      [
        createColumn(5, "0", NoteDuration.EIGHTH),
        createColumn(5, "0", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(5, "0", NoteDuration.EIGHTH),
        createColumn(5, "0", NoteDuration.EIGHTH),
      ],
      1,
    ),
    makeTact(
      [
        createColumn(5, "3", NoteDuration.EIGHTH),
        createColumn(5, "3", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(5, "3", NoteDuration.EIGHTH),
        createColumn(5, "3", NoteDuration.EIGHTH),
      ],
      2,
    ),
    makeTact(
      [
        createColumn(5, "3", NoteDuration.EIGHTH),
        createColumn(5, "3", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(3, "2", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(4, "1", NoteDuration.EIGHTH),
        createColumn(5, "3", NoteDuration.EIGHTH),
        createColumn(5, "3", NoteDuration.EIGHTH),
      ],
      3,
    ),
  ]),
  // makeSong("Test", "Test", 100, [
  //   makeTact(
  //     [
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //     ],
  //     0,
  //   ),
  //   makeTact(
  //     [
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //     ],
  //     1,
  //   ),
  //   makeTact(
  //     [
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //       createColumn(3, "3", NoteDuration.EIGHTH),
  //     ],
  //     2,
  //   ),
  // ]),
];
