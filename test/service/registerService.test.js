'use strict';

const request = require('supertest');
const app = require('../../server');

const {AuthDAO, UserDAO, ValueAlreadyTakenError, BadRequestError} = require('../../server/dataAccess/dataAccess');
const {User} = require("../../server/models");
const {RegisterService} = require('../../server/services/services');
const {AuthRequest} = require("../../server/http");

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new AuthDAO();
    userDAO = new UserDAO();

    service = new RegisterService(authDAO, userDAO);
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

test('register_then_get_user_returns_user', (done) => {
    service.register(new AuthRequest("user1", "pass1"));
    expect(userDAO.getUser("user1")).toBe(new User("user1", "pass1"));
});


// Negative test

test('register_existing_user_throws_already_taken', (done) => {
    service.register(new AuthRequest("user1", "pass1"));
    expect(() => service.register(new AuthRequest("user1", "pass1"))).toThrow(ValueAlreadyTakenError);
});


test('register_with_null_username_throws_bad_request_error', (done) => {
    expect(() => service.register(new AuthRequest(null, "pass1"))).toThrow(BadRequestError);
});


test('register_with_null_password_throws_bad_request_error', (done) => {
    expect(() => service.register(new AuthRequest("user1", null))).toThrow(BadRequestError);
});


test('register_with_blank_username_throws_bad_request_error', (done) => {
    expect(() => service.register(new AuthRequest("", "pass1"))).toThrow(BadRequestError);
});


test('register_with_blank_password_throws_bad_request_error', (done) => {
    expect(() => service.register(new AuthRequest("user1", ""))).toThrow(BadRequestError);
});