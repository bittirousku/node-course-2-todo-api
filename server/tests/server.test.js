// NOTE the server must not be running in the same port!
const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("../server.js");
const {Todo} = require("../models/todo.js");
const {User} = require("../models/user.js");

const todos = [{
    _id: new ObjectID(),
    text: "First test"
  }, {
    _id: new ObjectID(),
    text: "second test"
  }];

beforeEach((done) => {
  //remove everything before a test
  //is this cool?? it modifies the production database for testing??
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    done();
  });
});

describe("POST /todos", () => {
  it("should create a new TODO", (done) => {
    let text = "test todo";

    request(app)
      .post("/todos")
      .send({
        text: text
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text).toBeA("string");
      })
      .end((err, response) => {
        if (err) {
          return done(err);
        }
        Todo.find({text: text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it("should not create a TODO with invalid data", (done) => {
    request(app)
      .post("/todos")
      .send({})  // invalid data
      .expect(400)
      .end((err, response) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(todos.length);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });
});

describe("GET /todos", () => {
  it("should get all the todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return todo doc", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    let wrongHexId = new ObjectID();
    request(app)
      .get(`/todos/${wrongHexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids", (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
