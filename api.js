const express = require('express');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3')
const moment = require('moment');
var router = express.Router();

var db = new Database('.data/database.db');

// middleware
function protect(req, res, next) {
  try {
    req.account = db.prepare("SELECT * FROM users WHERE id = ?"). get(jwt.verify(req.body.token, process.env.SECRET).id);
    next();
  } catch (e) {
    res.json({"error": "token"});
  }
}

// routes
router.post("/token", function(req, res) {
  const statement = db.prepare("SELECT * FROM users WHERE username = ?");
  const account = statement.get(req.body.username);
  if (account == undefined) {
    res.json({"error": "username"});
  } else if (req.body.password != account.password) {
    res.json({"error": "password"});
  } else {
    res.json({"error": undefined, "token": jwt.sign({ id: account.id }, process.env.SECRET)});
  }
});

router.get("/posts/:id", function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.json({"error": "id"});
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(post.user_id);
  var comments = [];
  for (var comment of db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY date").all(req.params.id)) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(comment.user_id);
    var replies = [];
    for (var reply of db.prepare("SELECT * FROM replies WHERE comment_id = ? ORDER BY date DESC").all(comment.comment_id)) {
      const reply_user = db.prepare("SELECT * FROM users WHERE id = ?").get(reply.user_id);
      replies.push({
        id: reply.id,
        user: {
          id: reply_user.id,
          username: reply_user.username
        },
        comment: reply.content,
        date_created: reply.date
      });
    }
    comments.push({
      id: comment.comment_id,
      user: {
        id: user.id,
        username: user.username
      },
      post_id: comment.post_id,
      comment: comment.content,
      replies: replies,
      date_created: comment.date
    });
  }
  var liked = [];
  for (const user_liked of db.prepare("SELECT * FROM likes WHERE post_id = ?").all(req.params.id)) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(user_liked.user_id);
    liked.push({
      id: user.id,
      username: user.username
    });
  }
  res.json({
    id: post.id,
    user: {
      id: user.id,
      username: user.username
    }, 
    title: post.title,
    content: post.content,
    likes: liked,
    comments: comments,
    date_created: post.date
  });
});

router.post("/post", protect, function(req, res) {
  if (req.body.title == undefined)
    res.send({"error": "no title"});
  else if (req.body.content == undefined)
    res.send({"error": "no content"});
  const id = db.prepare("SELECT MAX(id) FROM posts").get()["MAX(id)"] + 1;
  db.prepare("INSERT INTO posts VALUES (?, ?, ?, ?, ?)").run(id, req.body.title, req.body.content, req.account.id, moment().format());
  db.prepare("INSERT INTO likes VALUES (?, ?)").run(id, req.account.id);
  res.send({"status": "ok"});
});

router.post("/posts/:id/like", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.json({"error": "id"});
  const likes = db.prepare("SELECT * FROM (SELECT * FROM likes WHERE post_id = ?) WHERE user_id = ?").get(req.params.id, req.account.id);
  if (likes != undefined) {
    res.json({"error": "already liked"});
  } else {
    db.prepare("INSERT INTO likes VALUES (?, ?)").run(req.params.id, req.account.id);
    res.json({"status": "ok"});
  }
});

router.post("/posts/:id/comment", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined) 
    res.send({"error": "id"});
  else if (req.body.comment == undefined)
    res.send({"error": "no comment"});
  else {
    const id = db.prepare("SELECT MAX(comment_id) FROM comments").get()["MAX(comment_id)"] + 1;
    db.prepare("INSERT INTO comments VALUES (?, ?, ?, ?, ?)").run(id, req.params.id, req.body.comment, req.account.id, moment().format());
    res.send({"status": "ok"});
  }
});

router.post("/posts/:id/reply", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.send({"error": "id"});
  else if (req.body.comment_id == undefined)
    res.send({"error": "no comment_id"});
  else if (req.body.reply == undefined)
    res.send({"error": "no reply"});
  else {
    const id = db.prepare("SELECT MAX(id) FROM replies").get()["MAX(id)"] + 1;
    db.prepare("INSERT INTO replies VALUES (?, ?, ?, ?, ?)").run(id, req.body.comment_id, req.body.reply, req.account.id, moment().format());
  }
  res.send({"status": "ok"});
});

router.get("/timeline", function(req, res) {
  var response = [];
  for (const post of db.prepare("SELECT * FROM posts ORDER BY date DESC LIMIT 10").all()) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(post.user_id);
    
    var liked = [];
    for (const user_liked of db.prepare("SELECT * FROM likes WHERE post_id = ?").all(post.id)) {
      const user_here = db.prepare("SELECT * FROM users WHERE id = ?").get(user_liked.user_id);
      liked.push({
        id: user_here.id,
        username: user_here.username
      });
    }
    
    response.push({    
      id: post.id,
      user: {
        id: user.id,
        username: user.username
      }, 
      title: post.title,
      content: post.content,
      likes: liked,
      date_created: post.date
    });
  }
  res.json(response);
});

module.exports = router;

// one a side note jacob i really think you should remove all those if elses for checking body data shit stuff.
// also please get ids to be randomly generated 

// DROP TABLE posts; DROP TABLE users; DROP TABLE likes; DROP TABLE comments; CREATE TABLE posts (id INT, title CHAR(10), content CHAR(3000), user_id INT, date CHAR(16)); CREATE TABLE users(id INT, username CHAR(10), password CHAR(16)); CREATE TABLE likes (post_id INT, user_id INT); CREATE TABLE comments (comment_id INT, post_id INT, content CHAR(3000), user_id INT, date CHAR(16)); CREATE TABLE replies (id INT, comment_id INT, content CHAR(500), user_id INT, date CHAR(30)); INSERT INTO users VALUES ('1', 'admin', 'password'); INSERT INTO users VALUES ('2', 'mooshoe', 'moocowspassword'); INSERT INTO posts VALUES ('1000000', 'First post!', '{content}', '1', '2018-12-09T17:09:47+00:00'); INSERT INTO likes VALUES ('1000000', '1'); INSERT INTO comments VALUES ('1', '1000000', '{comment}', '1', '2018-12-14T00:17:46+00:00'); INSERT INTO replies VALUES ('1', '1', '{reply}', '2', '2018-12-15T19:26:41+00:00');