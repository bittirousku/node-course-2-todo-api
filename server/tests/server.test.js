// NOTE the server must not be running in the same port!
// But Mongodb must be up and running
const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("../server.js");
const {Todo} = require("../models/todo.js");
const {User} = require("../models/user.js");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed.js");

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe("DELETE /todos/:id", () => {
  it("should remove a todo", (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it("should return 404 if todo not found", (done) => {
    let wrongHexId = new ObjectID();
    request(app)
      .get(`/todos/${wrongHexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if objectid is invalid", (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", (done) => {
    let id = todos[0]._id.toHexString();
    let text = "Todo finished in a test";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: text,
        completed: true
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.text).toNotBe(todos[0].text);
        expect(response.body.todo.completed).toBe(true);
        expect(response.body.todo.completedAt).toBeAn("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not complete", (done) => {
    let id = todos[1]._id.toHexString();
    let text = "Let's make the finished todo not complete";
    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: text,
        completed: false
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.text).toNotBe(todos[1].text);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)  // set header
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", (done) => {
    let email = "exx@exxample.com";
    let password = "supersexret";

    request(app)
      .post("/users")
      .send({email: email, password: password})
      .expect(200)
      .expect((response) => {
        expect(response.headers["x-auth"]).toExist();
        expect(response.body._id).toExist();
        expect(response.body.email).toBe(email);
      })
      // Let's create a custom end handler
      // do additional tests after the actual HTTP tests
      // have been completed:
      .end((err) => {
        if (err) {
          return done();
        }
        User.findOne({email: email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

  it("should return validation errors if request invalid", (done) => {
    request(app)
      .post("/users")
      .send({email: "kekkonen.urho.fi", password: "xxx"})
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", (done) => {
    request(app)
      .post("/users")
      .send({email: users[0].email, password: users[0].password})
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("should login user and return auth token", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers["x-auth"]).toExist();
      })
      .end((error, response) => {
        if (error) {
          return done();
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: "auth",
            token: response.headers["x-auth"]
          });
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });

  it("should reject invalid login", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: "vääräsalasana"
      })
      .expect(400)
      .expect((response) => {
        expect(response.headers["x-auth"]).toNotExist();
      })
      .end((error, response) => {
        if (error) {
          return done();
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", (done) => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((error, response) => {
        if (error) {
          return done();
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => {
          done(error);
        });
      });
  });
});
