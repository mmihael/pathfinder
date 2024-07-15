const fs = require('fs');

class PathReader {

  readFromFile = (filePath) => {
    return this.generatePathFromString(fs.readFileSync(filePath).toString());
  }

  generatePathFromString = (pathString) => {
    return pathString.split('\n').map(line => line.split(''));
  }

}

module.exports = PathReader; 