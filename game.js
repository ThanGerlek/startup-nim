const DEFAULT_BOARD_DIMENSIONS = [1, 3, 5, 7];

import { setupWaitNotification, cancelWaitNotification, displayMessage, clearMessageDisplay } from "./message-display.js";

// TODO. Add persistence across page reloads
// Store the actual board state in localStorage, and deserialize into window.game upon page load?

// TODO Don't let player unmark nodes that were taken in a previous turn
// Replace boolean with a ternary value?

function onLoad() {
    //TODO test for server connection?
    silentAuthenticateToken();
    setUpGame();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
}

function onResetButtonClick() {
    console.log(`Reset button was clicked.`);
    // TODO
}

function onPieceClick(rowIndex, pieceIndex) {
    console.log(`Piece in row ${rowIndex}, index ${pieceIndex} was clicked.`);
    // TODO
}

function setUpGame() {
    console.log('Setting up Game');
    let isPlayerTurn = true;
    let boardContainerElement = document.getElementById('board-container');
    let game = new Game(boardContainerElement, DEFAULT_BOARD_DIMENSIONS, isPlayerTurn);
}

function opponentWin() {
    // TODO
    console.log('Opponent win');
}

function playerWin() {
    // TODO
    console.log('Player win');
}

function markElementTaken(element) {
    // TODO. Replace opacity with a bootstrap mask
    element.style.opacity = 0.5;
}

function markElementNotTaken(element) {
    element.style.opacity = 1.0;
}

function constructGamepieceElement(onclickListener) {
    const gamepieceElement = document.createElement('input');
    gamepieceElement.type = "image";
    gamepieceElement.alt = "matchstick";
    gamepieceElement.height = "50";
    gamepieceElement.src = "img/150-750-matchstick.png";
    gamepieceElement.className = "px-2";

    // const outer = document.createElement('div');
    // outer.className = "container d-flex justify-content-center cursor-pointer";
    // outer.role = "button";
    gamepieceElement.addEventListener('click', onclickListener);
    // outer.appendChild(gamepieceElement);

    return gamepieceElement;
}

function constructRowContainerElement() {
    const rowContainerElement = document.createElement('div');
    rowContainerElement.className = "container py-2 d-flex justify-content-around";
    return rowContainerElement;
}

class Gamepiece {
    #taken = false;
    #gamepieceElement;

    constructor(gamepieceElement) {
        if (gamepieceElement) {
            this.#gamepieceElement = gamepieceElement;
            markElementNotTaken(gamepieceElement);
            gamepieceElement.addEventListener('click', () => this.toggleIsTaken());
        } else {
            this.#gamepieceElement = null;
        }
    }

    isTaken() {return this.#taken;}

    toggleIsTaken() {
        this.setIsTaken(!this.isTaken());
    }

    setIsTaken(taken) {
        if (this.#taken == taken) {
            throw new Error(`Tried to mark a piece as taken='${taken}' that already had that status.`);
        } else {
            this.#taken = taken;
            this.updateElement();
        }
    }

    updateElement() {
        if (this.#gamepieceElement) {
            if (this.isTaken()) {
                markElementTaken(this.#gamepieceElement);
            } else {
                markElementNotTaken(this.#gamepieceElement);
            }
        }
    }
}

class Row {
    #pieces;
    #size;
    #numPiecesLeft;
    #rowContainerElement;

    constructor(size, rowContainerElement) {
        this.#pieces = [];
        this.#size = size;
        this.#numPiecesLeft = size;
        this.#rowContainerElement = rowContainerElement;

        for (let i = 0; i < size; i++) {
            this.addNewGamepiece();
        }
    }

    size() {return this.#size;}

    isTaken(pieceIndex) {
        return this.#pieces[pieceIndex].isTaken();
    }

    markTaken(pieceIndex) {
        let piece = this.#pieces[pieceIndex];
        if (!piece.isTaken()) {
            piece.setIsTaken(true);
            this.#numPiecesLeft--;
        }
    }

    addNewGamepiece() {
        let gamepieceElement = null;
        if (this.#rowContainerElement) {
            gamepieceElement = constructGamepieceElement();
            this.#rowContainerElement.appendChild(gamepieceElement);
        }
        this.#pieces.push(new Gamepiece(gamepieceElement));
    }

    copyStateFrom(otherRow) {
        if (this.size() != otherRow.size()) {
            throw new Error("Mismatched row sizes when calling row.copyStateFrom()");
        }
        this.#pieces = [];
        for (let i = 0; i < this.size() && i < otherRow.size(); i++) {
            let isPieceTaken = otherRow.isPieceTaken(i);
            this.#pieces[i].setIsTaken(isPieceTaken);
        }
    }
}

class Board {
    #rows;
    #boardContainerElement;

    constructor(boardDimensions, boardContainerElement) {
        this.#rows = [];
        this.#boardContainerElement = boardContainerElement;

        let numRows = boardDimensions.length;
        for (let i = 0; i < numRows; i++) {
            let rowSize = boardDimensions[i];
            this.addNewRow(rowSize);
        }
    }

    numPiecesLeft() {
        let numLeft = 0;
        for (let row in this.#rows) {
            numLeft += row.numPiecesLeft();
        }
        return numLeft;
    }

    isTaken(rowIndex, pieceIndex) {
        return this.#rows[rowIndex].isTaken(pieceIndex);
    }

    markTaken(rowIndex, pieceIndex) {
        this.#rows[rowIndex].markTaken(pieceIndex);
    }

    addNewRow(rowSize) {
        let rowContainerElement = null;
        if (this.#boardContainerElement) {
            rowContainerElement = constructRowContainerElement();
            this.#boardContainerElement.appendChild(rowContainerElement);
        }
        this.#rows.push(new Row(rowSize, rowContainerElement));
    }

    copyStateFrom(otherBoard) {
        for (let rowIndex = 0; rowIndex < this._rows.length; rowIndex++) {
            this.#rows[rowIndex].copyStateFrom(otherBoard.#rows[rowIndex]);
        }
    }
}

class Game {
    #isPlayerTurn;
    #gameBoard;
    #localBoard;
    #rowBeingEdited;

    constructor(boardContainerElement, boardDimensions, isPlayerTurn) {
        this.#isPlayerTurn = isPlayerTurn;
        this.#gameBoard = new Board(boardDimensions, null); // TODO. Replace 1-param constructor with a subclass of Board
        this.#localBoard = new Board(boardDimensions, boardContainerElement);
        this.#rowBeingEdited = null; // TODO Track rowBeingEdited
    }

    isGameOver() {
        return this.#gameBoard.numPiecesLeft() == 0;
    }

    takePiece(rowIndex, pieceIndex) {
        // TODO test if valid (this piece is already taken, piece in a different row also selected, etc.)
        if (this.#rowBeingEdited) {
            if (this.#rowBeingEdited == rowIndex) {
                this.#localBoard.markTaken(rowIndex, pieceIndex);
            } else {
                displayMessage('warn', `You can only take pieces from one row.`);
            }
        }
    }

    submitMove() {
        // Check valid move (at least one piece must have been taken)
        this.#gameBoard.copyStateFrom(this.#localBoard);
        // TODO send move to server
    }

    resetMove() {
        this.#localBoard.copyStateFrom(this.#gameBoard);
    }
}


document.addEventListener('DOMContentLoaded', onLoad);
document.getElementById('submit-board-button').addEventListener('click', () => onSubmitButtonClick());
document.getElementById('reset-board-button').addEventListener('click', () => onResetButtonClick());
