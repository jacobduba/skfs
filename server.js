require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const moment = require('moment');
const fs = require('fs');
const app = express();

if (!fs.existsSync('.data/database.db')) {
  var db = Database('.data/database.db');
  console.log("No previous database found, creating new database in the .data folder.");

  // Tables
  db.prepare("CREATE TABLE posts (id INT, title CHAR(10), content CHAR(3000), user_id INT, date CHAR(16))").run();
  db.prepare("CREATE TABLE users(id INT, username CHAR(10), password CHAR(16))").run();
  db.prepare("CREATE TABLE likes (post_id INT, user_id INT)").run();
  db.prepare("CREATE TABLE comments (id INT, post_id INT, content CHAR(3000), user_id INT, date CHAR(16))").run();
  db.prepare("CREATE TABLE replies (id INT, comment_id INT, content CHAR(500), user_id INT, date CHAR(30))").run();

  // Default Entries
  db.prepare("INSERT INTO users VALUES ('1', 'admin', 'password')").run();
  db.prepare("INSERT INTO posts VALUES ('1000000', 'First post!', '{content}', '1', ?)").run(moment().format());
  db.prepare("INSERT INTO likes VALUES ('1000000', '1')").run();
  db.prepare("INSERT INTO comments VALUES ('1', '1000000', '{comment}', '1', ?)").run(moment().format());
  db.prepare("INSERT INTO replies VALUES ('1', '1', '{reply}', '2', ?);").run(moment().format());

  // More entries for delevopers to play around with
  if (process.env.NODE_ENV !== 'production') {
    db.prepare("INSERT INTO users VALUES ('2', 'developer', 'password')").run();
    db.prepare("INSERT INTO posts VALUES ('1000001', 'Here is another post!', '{more content}', '2', ?)").run(moment().add(1, 's').format());
    db.prepare("INSERT INTO likes VALUES ('1000001', '2')").run();
    db.prepare("INSERT INTO likes VALUES ('1000000', '2')").run();
    db.prepare("INSERT INTO comments VALUES ('2', '1000002', '{a second comment}', '1', ?)").run(moment().add(1, 's').format());
    db.prepare("INSERT INTO comments VALUES ('3', '1000003', '{a third comment}', '2', ?)").run(moment().add(2, 's').format());
    db.prepare("INSERT INTO replies VALUES ('2', '1', '{here is another reply}', '1', ?);").run(moment().add(1, 's').format());
    db.prepare("INSERT INTO replies VALUES ('3', '2', '{third reply, just for you!}', '2', ?);").run(moment().add(2, 's').format());
  }
}

const api = require("./api.js");
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", api);

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
