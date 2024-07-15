const PathFinder = require("../services/path_finder");

test("Single end char", () => {
  const pathFinder = new PathFinder([
    ['x', '@']
  ]);
  expect(pathFinder.ensureThereIsSingleEndChar()).toBe(undefined);
});

test("Multiple end chars", () => {
  const pathFinder = new PathFinder([
    ['x', 'x', '@']
  ]);
  expect(() => {
    pathFinder.ensureThereIsSingleEndChar();
  }).toThrow();
});

test("No end chars", () => {
  const pathFinder = new PathFinder([
    ['', '', '@']
  ]);
  expect(() => {
    pathFinder.ensureThereIsSingleEndChar();
  }).toThrow();
});