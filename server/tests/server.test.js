const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require("mongodb");

const {app} = require ("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/todo");
const {todos, populateTodos, users, populateUSers} = require('./seed/seed');

beforeEach(populateUSers);
beforeEach(populateTodos);


describe("POST / todos", ()=>{

  it("should create a new todo", (done)=>{

    var text="Test todo text";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done (e));
      });
  });
  it("Should not create todo with invalid body data", (done)=>{
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res)=>{
        if (err) {
          return done(err);
        }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });

});

describe("GET /todos", ()=>{
  it("Should get all todos", (done)=>{
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", ()=>{
  it("Should return todo doc", (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it("Should return 404 if todo not found", (done)=>{
    request(app)
      .get(`/todos/${ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it("Should return 404 for non-object ids", (done)=>{
    request(app)
      .get("/todos/1234")
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", ()=>{
  it("Should remove a todo", (done)=>{
    var hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) =>{
        if (err) {
          return done(err);
        }

        Todo.findById(hexID).then((todo)=>{
          expect(todo).toNotExist();
          done();
        }).catch((e)=> done(e));
      });
  });
  it("Shoul return 404 if todo not found",(done)=>{
    request(app)
      .delete(`/todos/${ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it("Should return 404 if objectID invalid", (done)=>{
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id", ()=>{
  it("Should update a todo", (done)=>{
    var hexID = todos[1]._id.toHexString();
    var text = "Updated";
    request(app)
      .patch(`/todos/${hexID}`)
      .send({text, completed: true})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });
  it("Should clear compleatedAt when todo is not compleated", (done)=>{

    var hexID = todos[1]._id.toHexString();
    var text = "Updated";
    request(app)
      .patch(`/todos/${hexID}`)
      .send({text, completed: false})
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

  })
});

describe("GET /users/me", () => {

  it("Should return user if authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("Should return 401 if not authenticate", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe("POST /users", ()=>{
  it("Should create a user", (done)=>{
    var email= "example@example.com";
    var password="123mnb";

    request(app)
      .post("/users")
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(done);
  });

  it("Should return validation errors if request invalid", (done)=>{
    request(app)
      .post("/users")
      .send({
        email:"and",
        password: "123"
      })
      .expect(400)
      .end(done);
  });
  it("Should not create user if email in use", (done)=>{
    request(app)
      .post("/users")
      .send({
        email:users[0].email,
        password: "Password123"
      })
      .expect(400)
      .end(done);
  });
});
