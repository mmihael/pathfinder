const PathReader = require('./services/path_reader.js');
const PathFinder = require('./services/path_finder.js');

const pathReader = new PathReader();
const matrice = pathReader.readFromFile(process.argv[2]);

const pathFinder = new PathFinder(matrice);
pathFinder.findPath();

console.log(`Path chars: ${pathFinder.getPahtChars()}`);
console.log(`Letters: ${pathFinder.getLetters()}`);
