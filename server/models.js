'use strict';

let User = class {
    #username;
    #password;
    stats;

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
        this.stats = {
            wins: 0, losses: 0, games: 0,
        };
    }

    username() {
        return this.#username;
    }

    password() {
        return this.#password;
    }
}

let AuthToken = class {
    #token;

    constructor(token) {
        this.#token = token;
    }

    token() {
        return this.#token;
    }
}

let Game = class {
    #board;
    #isFirstPlayerTurn;

    constructor(board, isFirstPlayerTurn) {
        this.#board = board;
        this.#isFirstPlayerTurn = isFirstPlayerTurn;
    }

    getBoard() {
        return this.#board;
    }

    updateBoard(newBoard) {
        this.#board = newBoard;
    }

    isFirstPlayerTurn() {
        return this.#isFirstPlayerTurn;
    }

    toggleTurn() {
        this.#isFirstPlayerTurn = !this.#isFirstPlayerTurn;
    }
}

module.exports = {User, Game, AuthToken};