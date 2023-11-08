const AuthDAO = require("./authDataAccess");
const GameDAO = require("./gameDataAccess");
const GameRequestDAO = require("./gameRequestDataAccess");
const UserDAO = require("./userDataAccess");

module.exports = {
    authDAO: new AuthDAO(), gameDAO: new GameDAO(), gameRequestDAO: new GameRequestDAO(), userDAO: new UserDAO()
};