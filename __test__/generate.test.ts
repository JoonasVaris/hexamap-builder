import {
  findAndAssignNeighbours,
  generateHexagonJSON,
  generateHexagons,
  readHexaJSON,
} from "../src/generate";
import { promises } from "fs";
import PathUtils from "path";

const testfolderpath = "./test-data";

beforeAll(async () => {
  await promises.rm(testfolderpath, { recursive: true, force: true });
  await promises.mkdir(testfolderpath);
});

test("can generate", () => {
  const hexas = generateHexagons({ height: 3 });
  expect(hexas.size).toBe(4);
});

test("scales as expected", () => {
  const hexas = generateHexagons({ height: 5 });
  expect(hexas.size).toBe(9);
});

test("can generate bigger ones too", () => {
  const hexas = generateHexagons({ height: 99 });
  expect(hexas.size).toBe(2500);
});

test("coordinates work as expected", () => {
  const hexas = generateHexagons({ height: 3 });
  const hexArray = Array.from(hexas);

  expect(hexArray.length).toBe(4);
  expect(hexArray[0]).toStrictEqual({
    id: 0,
    x: 0,
    y: 0,
    neighbourIds: [],
  });
  expect(hexArray[1]).toStrictEqual({
    id: 1,
    x: -1,
    y: 1,
    neighbourIds: [],
  });
  expect(hexArray[2]).toStrictEqual({
    id: 2,
    x: 1,
    y: 1,
    neighbourIds: [],
  });
  expect(hexArray[3]).toStrictEqual({
    id: 3,
    x: 0,
    y: 2,
    neighbourIds: [],
  });
});

test("can assign neighbours", () => {
  const hexas = generateHexagons({ height: 3 });
  findAndAssignNeighbours(hexas);

  const hexArray = Array.from(hexas);

  expect(hexArray.length).toBe(4);
  expect(hexArray[0]).toStrictEqual({
    id: 0,
    x: 0,
    y: 0,
    neighbourIds: [1, 2, 3],
  });
  expect(hexArray[1]).toStrictEqual({
    id: 1,
    x: -1,
    y: 1,
    neighbourIds: [0, 3],
  });
  expect(hexArray[2]).toStrictEqual({
    id: 2,
    x: 1,
    y: 1,
    neighbourIds: [0, 3],
  });
  expect(hexArray[3]).toStrictEqual({
    id: 3,
    x: 0,
    y: 2,
    neighbourIds: [0, 1, 2],
  });
});

test("can write file", async () => {
  const path = PathUtils.join(testfolderpath, "hexas.json");
  await generateHexagonJSON(5, path);
  const buffer = await promises.readFile(path);
  const str = buffer.toString("utf-8");
  expect(JSON.parse(str).length).toBe(9);
});

test("can read file", async () => {
  const path = PathUtils.join(testfolderpath, "hexas.json");
  await generateHexagonJSON(3, path);
  const hexas = await readHexaJSON(path);
  expect(hexas.size).toBe(4);
});
