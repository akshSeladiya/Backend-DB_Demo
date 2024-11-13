const { faker } = require('@faker-js/faker');
// const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: "aksh99135",
});

// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

//Home Route
app.get("/", (req, res) => {
  let q = `SELECT count (*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count (*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

// Render form to ADD NEW User
app.get("/user/new", (req, res) => {
  res.render("adduser.ejs");
});

//Add New User Route
app.post("/post", (req, res) => {
  const id = faker.string.uuid();
  const { username, email, password } = req.body;
  const q = 'INSERT INTO user(id, username, email, password) VALUES (?,?,?,?)';
  try {
    connection.query(q, [id, username, email, password], (err) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occurred while adding a new user.");
  }
});

//Show Route
app.get("/user", (req, res) => {
  let q = 'SELECT * FROM user';
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

//Edit User Route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

//Update User/DATABASE Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPassword, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPassword != user.password) {
        res.send("Wrong Password");
      }
      else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  }
});

//Delete user Route
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const q = 'DELETE FROM user WHERE id = ?';
  try {
    connection.query(q, [id], (err) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occurred while deleting the user.");
  }
});

app.listen("8080", () => {
  console.log("Server is listening to port 8080");
});





