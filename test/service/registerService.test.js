'use strict';

const request = require('supertest');
const app = require('../../server');

const dataAccess = require('../../server/dataAccess/dataAccess');
const models = require('../../server/models');
const services = require('../../server/services/services');

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new dataAccess.AuthDAO();
    userDAO = new dataAccess.UserDAO();

    service = new services.RegisterService(authDAO, userDAO);
});

test('invalid URL returns 404', (done) => {
    request(app)
        .put('/thing')
        .send({msg: 'an invalid request'})
        .expect(404)
        .expect({})
        .end((err) => err ? done(err) : done());
});


// Positive test

test('get_registered_user_returns_user', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});

// Negative test

test('register_existing_user_throws_already_taken', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_new_user_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_with_null_username_throws_bad_request_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_with_null_password_throws_bad_request_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_with_null_email_returns_user', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});