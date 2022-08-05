import { promises } from "fs";

export interface Hexagon {
  id: number;
  x: number;
  y: number;
  neighbourIds: number[];
}

export function generateHexagons(options: { height: number }): Set<Hexagon> {
  let id = 0;
  if (isEven(options.height)) {
    throw new Error("Height must be odd");
  }

  const hexaSet: Set<Hexagon> = new Set();

  const levels = [...Array(options.height).keys()];

  for (const level of levels) {
    const width = getWidthInHexas({
      height: options.height,
      currentPos: level + 1, // arrays start at 0
    });

    const y = level;
    for (const index of Array(width).keys()) {
      hexaSet.add({
        id: id,
        y: y,
        x: getXCoordinate({
          currentRowWidth: width,
          currentXIndex: index,
        }),
        neighbourIds: [],
      });
      id++;
    }
  }

  return hexaSet;
}

function getWidthInHexas(options: {
  height: number;
  currentPos: number;
}): number {
  if (isEven(options.height)) {
    throw new Error("Height must be odd");
  }
  // middle row is always the height / 2 round up
  const middle = Math.ceil(options.height / 2);

  // distance from middle
  const distance = Math.abs(middle - options.currentPos);

  const width = middle - distance;

  return width;
}

function getXCoordinate(options: {
  currentRowWidth: number;
  currentXIndex: number;
}): number {
  if (options.currentRowWidth === 1 && options.currentXIndex === 0) {
    return 0;
  }

  const shiftedValues: number[] = [];
  for (const index of Array(options.currentRowWidth).keys()) {
    // width 4: -3, -1, 1, 3
    // width 3: -2, 0, 2
    shiftedValues.push(-(options.currentRowWidth - 1) + 2 * index);
  }

  const x = shiftedValues[options.currentXIndex];

  if (x === undefined) {
    throw new Error(
      `Unable to get X coordinate! currentIndex: ${options.currentXIndex}, currentRowWidth: ${options.currentRowWidth} shiftedValues: ${shiftedValues}`
    );
  } else {
    return x;
  }
}

function isEven(n: number) {
  return n % 2 === 0;
}

export function findAndAssignNeighbours(hexas: Set<Hexagon>) {
  for (const hexa of hexas) {
    const x = hexa.x;
    const y = hexa.y;

    for (const evaluate of hexas) {
      // upper left & right && bottom left & right
      if (evaluate.x === x - 1 || evaluate.x === x + 1) {
        if (evaluate.y === y - 1 || evaluate.y === y + 1) {
          hexa.neighbourIds.push(evaluate.id);
        }
      }

      // top and bottom
      if (evaluate.x === x) {
        if (evaluate.y === y - 2 || evaluate.y === y + 2) {
          hexa.neighbourIds.push(evaluate.id);
        }
      }
    }
  }
}

export async function generateHexagonJSON(height: number, path?: string) {
  const hexas = generateHexagons({ height });
  findAndAssignNeighbours(hexas);
  const data = JSON.stringify(Array.from(hexas));
  await promises.writeFile(path ?? "hexas.json", data);
}

export async function readHexaJSON(path?: string): Promise<Set<Hexagon>> {
  const buff = await promises.readFile(path ?? "hexas.json");
  const str = buff.toString("utf-8");
  const json = JSON.parse(str);
  return new Set(json);
}
