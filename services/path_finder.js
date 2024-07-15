const RIGHT = 'right';
const BOTTOM = 'bottom';
const LEFT = 'left';
const TOP = 'top';
const DIRECTION_ORDER = [RIGHT, BOTTOM, LEFT, TOP];

const letterRegex = /^[A-Z]$/;
const leftRightCharsRegex = /^[A-Z-+x]$/;
const bottomTopCharsRegex = /^[A-Z|+x]$/;

class PathFinder {

  constructor (matrice) {
    this.matrice = matrice;
    this.pathTaken = [];
    this.letters = '';
    this.debug = false;
  }

  getPahtChars = () => {
    return this.pathTaken.map(e => this.matrice[e.row][e.column]).join('');
  }

  getLetters = () => {
    return this.letters;
  }

  findPath = () => {

    this.ensureThereIsSingleEndChar();
    
    this.pathTaken.push(this.findStartCoordinate());
    
    let i = 0;

    do {

      if (this.debug) {
        console.log('Iteration: ' + i);
        console.log('Last step: ' + JSON.stringify(this.getLastCoordinate()));
        console.log('Letters: ' + this.letters);
        console.log('Path taken: ' + this.getPahtChars());
        console.log('----------------------');
        console.log('----------------------');
        console.log('----------------------');
      }

      let nextStep = this.findNextStep();

      if (nextStep == null) {
        throw new Error("Invalid path - not able to find next step");
      }

      if (letterRegex.test(this.matrice[nextStep.row][nextStep.column]) && !this.stepAlreadyTaken(nextStep)) {
        this.letters = this.letters + this.matrice[nextStep.row][nextStep.column];
      }

      this.pathTaken.push(nextStep);

      i = i + 1;
      if (i > 10000) {
        throw new Error("To many iterations");
      }

      if (this.matrice[nextStep.row][nextStep.column] === 'x') {
        break;
      }
    } while (true);
    
    this.findPathExecuted = true;

  }

  findStartCoordinate = () => {
    
    let startCoordinate = null;
    
    this.matrice.forEach((line, row) => {
      line.forEach((element, column) => {
        if (element === '@') {
          if (startCoordinate !== null) { throw new Error("Multiple start coordinates"); }
          startCoordinate = { row, column };
        }
      });
    });

    if (startCoordinate === null) {
      throw new Error("Missing start coordinates");
    }

    return startCoordinate;
  };

  ensureThereIsSingleEndChar = () => {
    
    let countX = 0; 
    
    this.matrice.forEach((line) => {
      line.forEach((element) => {
        if (element === 'x') {
          countX = countX + 1;
        }
      });
    });

    if (countX === 0) { throw new Error("Missing end char"); }
    if (countX > 1) { throw new Error("More than one end char"); }
  };

  charIsTurn = (char) => {
    return char === '+' || letterRegex.test(char);
  }

  getPossibleRightStepFrom = (coordinate) => {
    const charToRight = this.matrice[coordinate.row][coordinate.column + 1];
    if (
      this.isNonBlankChar(charToRight) && 
      (!this.charIsTurn(this.getCurrentChar()) || leftRightCharsRegex.test(charToRight))
    ) {
      return { row: coordinate.row, column: coordinate.column + 1 };
    }
  }

  getPossibleBottomStepFrom = (coordinate) => {
    if (this.matrice[coordinate.row + 1]) {
      const charToBottom = this.matrice[coordinate.row + 1][coordinate.column];
      if (
        this.isNonBlankChar(charToBottom) &&
        (!this.charIsTurn(this.getCurrentChar()) || bottomTopCharsRegex.test(charToBottom))
      ) {
        return { row: coordinate.row + 1, column: coordinate.column };
      }
    }
  }

  getPossibleLeftStepFrom = (coordinate) => {
    const charToLeft = this.matrice[coordinate.row][coordinate.column - 1];
    if (
      this.isNonBlankChar(charToLeft) && 
      (!this.charIsTurn(this.getCurrentChar()) || leftRightCharsRegex.test(charToLeft))
    ) {
      return { row: coordinate.row, column: coordinate.column - 1 };
    }
  }

  getPossibleTopStepFrom = (coordinate) => {
    if (this.matrice[coordinate.row - 1]) {
      const charToTop = this.matrice[coordinate.row - 1][coordinate.column];
      if (
        this.isNonBlankChar(charToTop) &&
        (!this.charIsTurn(this.getCurrentChar()) || bottomTopCharsRegex.test(charToTop))
      ) {
        return { row: coordinate.row - 1, column: coordinate.column };
      }
    }
  }

  getPossibleSteps = (coordinate, direction) => {
    
    const possibleSteps = {};
    
    if (direction !== LEFT) {
      const right = this.getPossibleRightStepFrom(coordinate);
      if (right) { possibleSteps.right = right; }
    }

    if (direction !== TOP) {
      const bottom = this.getPossibleBottomStepFrom(coordinate);
      if (bottom) { possibleSteps.bottom = bottom; }
    }

    if (direction !== RIGHT) {
      const left = this.getPossibleLeftStepFrom(coordinate);
      if (left) { possibleSteps.left = left; }
    }

    if (direction !== BOTTOM) {
      const top = this.getPossibleTopStepFrom(coordinate);
      if (top) { possibleSteps.top = top; }
    }

    if (this.debug) { console.log(possibleSteps); }

    return possibleSteps;
  };

  getDirection = () => {
    
    if (this.pathTaken.length < 2) { return; }

    const secondLastCoordinate = this.pathTaken[this.pathTaken.length - 2];
    const lastCoordinate = this.getLastCoordinate();
  
    if (lastCoordinate.column === secondLastCoordinate.column + 1) {
      return RIGHT;
    } else if (lastCoordinate.row === secondLastCoordinate.row + 1) {
      return BOTTOM;
    } else if (lastCoordinate.column === secondLastCoordinate.column - 1) {
      return LEFT;
    } else if (lastCoordinate.row === secondLastCoordinate.row - 1) {
      return TOP;
    } else {
      throw new Error('Invalid state, latest coordinates are not adjectant')
    }
  }

  findNextStep = () => {
    
    const lastCoordinate = this.getLastCoordinate();
    const currentChar = this.getCurrentChar();
    const direction = this.getDirection();
    const possibleSteps = this.getPossibleSteps(lastCoordinate, direction);

    if (currentChar === '@') {
      if (Object.keys(possibleSteps).length === 1) {
        return Object.values(possibleSteps)[0];
      } else {
        throw new Error("Invalid path - starting step should have only one possible direction");
      }
    } else {
      
      if (['-', '|'].indexOf(currentChar) !== -1) {
        
        if (possibleSteps[direction]) {
          return possibleSteps[direction];
        } else {
          throw new Error("Invalid path - can't follow the direction");
        }

      } else {

        if (currentChar !== '+' && possibleSteps[direction]) {
          return possibleSteps[direction];
        }

        if (Object.keys(possibleSteps).length > 1) {
          throw new Error("Invalid path - fork");
        }
        
        let checkOrder = [];
        let currentDirectionIndex = DIRECTION_ORDER.indexOf(direction);
        checkOrder = checkOrder.concat(DIRECTION_ORDER.slice(currentDirectionIndex + 1));
        checkOrder = checkOrder.concat(DIRECTION_ORDER.slice(0, currentDirectionIndex));

        for (let i = 0; checkOrder.length > i; i++) {
          let possibleStep = possibleSteps[checkOrder[i]];
          if (possibleStep) {
            return possibleStep;
          }
        }
        throw new Error("Invalid path - no valid step");
      }
    }
  };

  isNonBlankChar = (char) => {
      return char != null && char !== ' '
  }

  getLastCoordinate = () => {
    return this.pathTaken[this.pathTaken.length - 1];
  }

  getCharAt = (coordinate) => {
    return this.matrice[coordinate.row][coordinate.column];
  }

  getCurrentChar = () => {
    return this.getCharAt(this.getLastCoordinate());
  }

  stepAlreadyTaken = (step) => {
    return this.pathTaken.find(
      coordinate => coordinate.row === step.row && coordinate.column === step.column
    ) !== undefined;
  }

}

module.exports = PathFinder;