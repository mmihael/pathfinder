const PathFinder = require("../services/path_finder");

test.each(
  [
    { 
      row: 0,
      column: 0,
      matrice: [
        ['@']
      ]
    },
    { 
      row: 1,
      column: 2,
      matrice: [
        ['', ''],
        ['', '', '@']
      ]
    },
    { 
      row: 1,
      column: 1,
      matrice: [
        ['', '', ''],
        ['', '@', ''],
        ['', '', ''],
      ]
    },
  ]
)("Find start at $row : $column", ({ row, column, matrice }) => {
  const pathFinder = new PathFinder(matrice);
  const start = pathFinder.findStartCoordinate();
  expect(start.row).toBe(row);
  expect(start.column).toBe(column);
});

test.each(
  [
    { 
      matrice: [
        ['']
      ]
    },
    { 
      matrice: [
        ['', '', ''],
        ['', '@', ''],
        ['', '', '@'],
      ]
    },
  ]
)("Find start at $row : $column", ({ matrice }) => {
  const pathFinder = new PathFinder(matrice);
  expect(() => {
    pathFinder.findStartCoordinate();
  }).toThrow();
});