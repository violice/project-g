import type { Composition } from "../lib/music-player";
import { NoteFunctionType } from "../lib/music-player";

interface JsonNote {
  value: string;
  functionType: string | null;
  stringNumber: number;
}

interface JsonTactColumn {
  notes: JsonNote[];
  duration: number;
  numberInTact: number;
}

interface JsonTact {
  size: string;
  tactColumns: JsonTactColumn[];
  serialNumber: number;
}

interface JsonStave {
  tacts: JsonTact[];
  number: null;
  instrument: string;
}

export function jsonToComposition(json: JsonStave[], name: string, bpm: number): Composition {
  return {
    name,
    bpm,
    complexity: 3,
    description: `Imported from JSON`,
    videoLink: "",
    staves: json.map(stave => ({
      instrument: stave.instrument,
      tacts: stave.tacts.map(tact => ({
        sizeStr: tact.size,
        serialNumber: tact.serialNumber,
        notes: transposeTact(tact),
      })),
    })),
  };
}

function transposeTact(tact: JsonTact) {
  const columns = tact.tactColumns;
  const stringCount = 6;
  const columnCount = columns.length;

  const result: Array<Array<{ value: string; duration: number; functionType: NoteFunctionType }>> =
    [];

  for (let colIdx = 0; colIdx < columnCount; colIdx++) {
    const column: Array<{
      value: string;
      duration: number;
      functionType: NoteFunctionType;
    }> = [];
    for (let stringIdx = 0; stringIdx < stringCount; stringIdx++) {
      const note = columns[colIdx].notes.find(n => n.stringNumber === stringIdx);
      column.push({
        value: note?.value || "",
        duration: columns[colIdx].duration,
        functionType: (note?.functionType as NoteFunctionType) ?? NoteFunctionType.DEFAULT,
      });
    }
    result.push(column);
  }

  return result;
}
