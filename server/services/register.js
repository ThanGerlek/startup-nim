'use strict';

const {AuthResponse} = require('../http');

class RegisterService {
    #authDAO;
    #userDAO;

    constructor(authDAO, userDAO) {
        this.#authDAO = authDAO;
        this.#userDAO = userDAO;
    }

    register() {
        // TODO! services
        console.log("Called register()");

        return new AuthResponse("Registered user.", "1234");
    }
}

module.exports = {RegisterService};

// | **Request class**    | RegisterRequest                               |
// | **Response class**   | AuthResponse                                  |
// | **Description**      | Register a new user.                          |
// | **Body**             | `{ "username":"", "password":"" }`            |
// | **Success response** | [200] `{ "username":"", "token":"" }`         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`   |
// | **Failure response** | [403] `{ "message": "Error: already taken" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`   |
