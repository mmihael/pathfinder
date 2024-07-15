const PathFinder = require("../services/path_finder");
const PathReader = require("../services/path_reader");
const pathReader = new PathReader();

test.each(
  [
    {
      path: './paths/path_1.txt',
      expectedPathChars: '@---A---+|C|+---+|+-B-x',
      expectedLetters: 'ACB'
    },
    {
      path: './paths/path_2.txt',
      expectedPathChars: '@|A+---B--+|+--C-+|-||+---D--+|x',
      expectedLetters: 'ABCD'
    },
    {
      path: './paths/path_3.txt',
      expectedPathChars: '@---A---+|||C---+|+-B-x',
      expectedLetters: 'ACB'
    },
    {
      path: './paths/path_4.txt',
      expectedPathChars: '@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x',
      expectedLetters: 'GOONIES'
    },
    {
      path: './paths/path_5.txt',
      expectedPathChars: '@B+++B|+-L-+A+++A-+Hx',
      expectedLetters: 'BLAH'
    },
    {
      path: './paths/path_6.txt',
      expectedPathChars: '@-A--+|+-B--x',
      expectedLetters: 'AB'
    },
    {
      path: './paths/path_15.txt',
      expectedPathChars: '@B+++B|+-L-+A+++A-+Hx',
      expectedLetters: 'BLAH'
    },
    {
      path: './paths/path_16.txt',
      expectedPathChars: '@-ABC-x',
      expectedLetters: 'ABC'
    },
  ]
)("Test valid $path", ({ path, expectedPathChars, expectedLetters }) => {
  const matrice = pathReader.readFromFile(path);
  const pathFinder = new PathFinder(matrice);
  pathFinder.findPath();
  expect(pathFinder.getPahtChars()).toBe(expectedPathChars);
  expect(pathFinder.getLetters()).toBe(expectedLetters);
});

test.each(
  [
    { path: './paths/path_7.txt' },
    { path: './paths/path_8.txt' },
    { path: './paths/path_9.txt' },
    { path: './paths/path_10.txt' },
    { path: './paths/path_11.txt' },
    { path: './paths/path_12.txt' },
    { path: './paths/path_13.txt' },
    { path: './paths/path_14.txt' },
  ]
)("Test invalid $path", ({ path }) => {
  const matrice = pathReader.readFromFile(path);
  const pathFinder = new PathFinder(matrice);
  expect(() => {
    pathFinder.findPath();
  }).toThrow();
});