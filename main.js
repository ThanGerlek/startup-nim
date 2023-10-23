'use strict';

function logout() {
    invalidateToken(getAuthTokenFromLocalStorage());
    redirectToLoginPage();
}

async function silentAuthenticateToken() {
    await authenticateToken(() => {}, redirectToLoginPage);
}

async function authenticateToken(successAction, failureAction) {
    let existingToken = getAuthTokenFromLocalStorage();
    if (existingToken) {
        try {
            let response = await getAuthenticateTokenResponse(existingToken);
            parseAuthenticateTokenResponse(response, successAction, failureAction);
        } catch (err) {
            console.log('Failed to connect to the server when authenticating existing token.');
            failureAction();
        }
    } else {
        failureAction();
    }
}

async function getAuthenticateTokenResponse(token) {
    // Return artificial data

    return new Promise((resolve, reject) => {
        console.log(`Simulating accessing server to authenticate token. Token string: '${token.tokenString}'`);

        // TODO create time-based artificial data (including random server failures?)

        let response = {};

        if (token.username === "") {
            response = new ErrorResponse('invalidUser');
        } else if (token.tokenString == "") {
            response = new ErrorResponse('invalidTokenString');
        } else {
            response = new AuthResponse(token);
        }

        setTimeout(() => resolve(response), 2000);
        // resolve(response);
    });
}

function parseAuthenticateTokenResponse(response, successAction, failureAction) {
    if (response.value === 'token') {
        successAction();
    } else {
        console.log('Failed to authenticate existing token. Clearing token');
        invalidateToken(response.token);
        failureAction();
    }
}

function invalidateToken(token) {
    clearUserInfoFromLocalStorage();
    // TODO Send message to server to invalidate the token
}

function getAuthTokenFromLocalStorage() {
    let serializedToken = localStorage.getItem('authtoken');
    if (serializedToken) {
        let token = JSON.parse(serializedToken);
        let {username, tokenString} = token;
        console.log(`extracted user: ${username}, extracted string: ${tokenString}`);
        if (username && tokenString) {
            return token;
        }
    }
    return null;
}

function clearUserInfoFromLocalStorage() {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('user');
}

function redirectToLoginPage() {
    window.location.href = 'login.html';
}

function redirectToHomePage() {
    window.location.href = 'home.html';
}

class HTTPResponse {
    #value;
    constructor(value) {
        this.#value = value;
    }

    get value() {return this.#value;}
}

class ErrorResponse extends HTTPResponse {
    #errorType;
    constructor(errorType) {
        super('error');
        this.#errorType = errorType;
    }
    get errorType() {return this.#errorType;}
}

class AuthResponse extends HTTPResponse {
    #token;
    constructor(token) {
        super('token');
        this.#token = token;
    }
    get token() {return this.#token;}
}
