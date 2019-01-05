const express = require('express');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const moment = require('moment');
const fs = require('fs');
var router = express.Router();

var db = new Database('./.data/database.db');

// middleware
function protect(req, res, next) {
  try {
    req.account = db.prepare("SELECT * FROM users WHERE id = ?"). get(jwt.verify(req.body.token, process.env.SECRET).id);
    next();
  } catch (e) {
    res.status(401).json({"status": 401, "message": "You have not supplied a valid token."});
  }
}

// helpers
function getAvatarUrl(user) {
  if (fs.existsSync(__dirname + "/public/images/avatars/" + user.id + ".png")) {
    return process.env.URL + "/images/avatars/" + user.id + ".png";
  } else {
    return process.env.URL + "/images/avatars/default.png";
  }
}

// routes
// note to self that the plans are to replace this to make using the website mandatory and add control over with apps get to use it.
router.post("/token", function(req, res) {
  const account = db.prepare("SELECT * FROM users WHERE username = ?").get(req.body.username);
  if (account == undefined) {
    res.status(400).json({"status": 400, "message": "You have not supplied a user that exist."});
  } else if (!bcrypt.compareSync(req.body.password, account.password)) {
    res.status(400).json({"status": 400, "message": "You have the incorrect password for your user."});
  } else {
    res.status(200).json({"token": jwt.sign({ id: account.id }, process.env.SECRET)});
  }
});

router.get("/posts/:id", function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.status(404).json({"status": 404, "message": "Post does not exist."});
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(post.user_id);

  var comments = [];
  for (var comment of db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY date").all(req.params.id)) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(comment.user_id);
    var replies = [];
    for (var reply of db.prepare("SELECT * FROM replies WHERE comment_id = ? ORDER BY date DESC").all(comment.id)) {
      const reply_user = db.prepare("SELECT * FROM users WHERE id = ?").get(reply.user_id);
      replies.push({
        id: reply.id,
        user: {
          id: reply_user.id,
          username: reply_user.username,
          bio: reply_user.bio,
          avatar: getAvatarUrl(reply_user),
          date_created: reply_user.date
        },
        reply: reply.content,
        date_created: reply.date
      });
    }
    comments.push({
      id: comment.id,
      user: {
        id: user.id,
        username: user.username,
        bio: user.bio,
        avatar: getAvatarUrl(user),
        date_created: user.date
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
      username: user.username,
      bio: user.bio,
      avatar: getAvatarUrl(user),
      date_created: user.date
    });
  }

  res.status(200).json({
    id: post.id,
    user: {
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatar: getAvatarUrl(user),
      date_created: user.date
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
    res.status(400).json({"status": 400, "message": "You must suply a title."});
  else if (req.body.content == undefined)
    res.status(400).json({"status": 400, "message": "You must suply the content param."});
  const id = db.prepare("SELECT MAX(id) FROM posts").get()["MAX(id)"] + 1;
  db.prepare("INSERT INTO posts VALUES ( ?, ?, ?, ?, ?)").run(id, req.body.title, req.body.content, req.account.id, moment().format());
  db.prepare("INSERT INTO likes VALUES (?, ?)").run(id, req.account.id);
  res.status(200).json({"status": 200});
});

router.post("/posts/:id/like", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.status(404).json({"status": 404, "message": "Post does not exist."});
  const likes = db.prepare("SELECT * FROM (SELECT * FROM likes WHERE post_id = ?) WHERE user_id = ?").get(req.params.id, req.account.id);
  if (likes != undefined) {
    res.status(400).json({"status": 400, "message": "Already liked the post."});
  } else {
    db.prepare("INSERT INTO likes VALUES ( ?, ?, ?)").run(req.params.id, req.account.id, moment().format());
    res.status(200).json({"status": 200});
  }
});

router.post("/posts/:id/unlike", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.status(404).json({"status": 404, "message": "Post does not exist."});
  const like = db.prepare("SELECT * FROM likes WHERE user_id = ? and post_id = ?").get(req.account.id, req.params.id);
  if (like == undefined)
    res.status(400).json({"status": 400, "message": "Already don't like this post."});
  db.prepare("DELETE FROM likes WHERE user_id = ? and post_id = ?").run(req.account.id, req.params.id);
  res.status(200).json({"status": 200});
});

router.post("/posts/:id/comment", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined) 
    res.status(404).json({"status": 404, "message": "Post does not exist."});
  else if (req.body.comment == undefined)
    res.status(400).json({"status": 400, "message": "You must provide a 'comment' paramater."});
  else {
    const id = db.prepare("SELECT MAX(id) FROM comments").get()["MAX(id)"] + 1;
    db.prepare("INSERT INTO comments VALUES ( ?, ?, ?, ?, ?)").run(id, req.params.id, req.body.comment, req.account.id, moment().format());
    res.status(200).json({"status": 200});
  }
});

router.post("/posts/:id/reply", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.status(404).json({"status": 404, "message": "Post does not exist."});
  else if (db.prepare("SELECT * FROM comments WHERE id = ?").get(req.body.comment_id) == undefined)
    res.status(404).json({"status": 404, "message": "The comment provided from the 'comment_id' paramater does not exist."});
  else if (req.body.reply == undefined)
    res.status(400).json({"status": 400, "message": "You must provide a 'reply' paramater."});
  else {
    const id = db.prepare("SELECT MAX(id) FROM replies").get()["MAX(id)"] + 1;
    db.prepare("INSERT INTO replies VALUES ( ?, ?, ?, ?, ?)").run(id, req.body.comment_id, req.body.reply, req.account.id, moment().format());
    res.status(200).json({"status": 200});
  }
});

router.delete("/posts/:id", protect, function(req, res) {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (post == undefined)
    res.status(404).json({"status": 404, "message": "Post does not exist."});
  else if (post.user_id != req.account.id)
    res.status(403).json({"status": 403, "message": "You do not have the right to delete this post."});
  else {
    for (const comment of db.prepare("SELECT * FROM comments WHERE post_id = ?").all(post.id)) {
      db.prepare("DELETE FROM replies WHERE comment_id = ?").run(comment.id);
      db.prepare("DELETE FROM comments WHERE id = ?").run(comment.id);
    }
    db.prepare("DELETE FROM posts WHERE id = ?").run(post.id);
    db.prepare("DELETE FROM likes WHERE post_id = ?").run(post.id);
    res.status(200).json({"status": 200});
  }
});

router.delete("/comment", protect, function(req, res) {
  const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(req.body.comment_id);
  if (comment == undefined)
    res.status(404).json({"status": 404, "message": "Comment that you provided with the 'comment' paramater does not exist."});
  else if (comment.user_id != req.account.id)
    res.status(403).json({"status": 403, "message": "You do not have the right to delete this comment."});
  else {
    db.prepare("DELETE FROM replies WHERE comment_id = ?").run(req.body.comment_id);
    db.prepare("DELETE FROM comments WHERE id = ?").run(req.body.comment_id);
    res.status(200).json({"status": 200});
  }
});

router.delete("/reply", protect, function(req, res) {
  const reply = db.prepare("SELECT * FROM replies WHERE id = ?").get(req.body.reply_id);
  if (reply == undefined)
    res.status(400).json({"status": 400, "message": "You must provide a 'reply_id' paramater."});
  else if (reply.user_id != req.account.id)
    res.status(403).json({"status": 403, "message": "You do not have the right to delete this reply."});
  else {
    db.prepare("DELETE FROM replies WHERE id = ?").run(req.body.reply_id);
    res.status(200).json({"status": 200});
  }
});

router.get("/users/:id", function(req, res) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (user == undefined)
    res.status(404).json({"status": 404, "message": "This user does not exist."});

  var history = [
    ...db.prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY date DESC LIMIT 20").all(req.params.id).map(obj => {
      return {
        type: 'POST',
        post_id: obj.id,
        date: obj.date
      };
    }),
    ...db.prepare("SELECT * FROM likes WHERE user_id = ? ORDER BY date DESC LIMIT 20"). all(req.params.id).map(obj => {
      return {
        type: 'LIKE',
        post_id: obj.post_id,
        date: obj.date
      };
    }),
    ...db.prepare("SELECT * FROM comments WHERE user_id = ? ORDER BY date DESC LIMIT 20").all(req.params.id).map(obj => {
      return {
        type: 'COMMENT',
        post_id: obj.post_id,
        comment_id: obj.id,
        date: obj.date
      };
    }),
    ...db.prepare("SELECT * FROM replies WHERE user_id = ? ORDER BY date DESC LIMIT 20").all(req.params.id).map(obj => {
      const comment = db.prepare("SELECT * FROM comments WHERE id = ?").get(obj.comment_id);
      return {
        type: 'REPLY',
        post_id: comment.post_id,
        comment_id: obj.comment_id,
        reply_id: obj.id,
        date: obj.date
      };
    })
  ].sort(function(a, b) {
    return b.date.localeCompare(a.date);
  }).splice(0, 20);

  res.status(200).json({
    id: user.id,
    username: user.username,
    bio: user.bio,
    avatar: getAvatarUrl(user),
    history: history,
    date_created: user.date
  })
});

router.get("/timeline", function(req, res) {
  var response = [];
  for (const post of db.prepare("SELECT * FROM posts ORDER BY date DESC LIMIT 20").all()) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(post.user_id);

    var comments = [];
    for (var comment of db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY date").all(post.id)) {
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(comment.user_id);
      var replies = [];
      for (var reply of db.prepare("SELECT * FROM replies WHERE comment_id = ? ORDER BY date DESC").all(comment.id)) {
        const reply_user = db.prepare("SELECT * FROM users WHERE id = ?").get(reply.user_id);
        replies.push({
          id: reply.id,
          user: {
            id: reply_user.id,
            username: reply_user.username,
            bio: reply_user.bio,
            avatar: getAvatarUrl(reply_user),
            date_created: reply_user.date
          },
          comment: reply.content,
          date_created: reply.date
        });
      }
      comments.push({
        id: comment.id,
        user: {
          id: user.id,
          username: user.username,
          bio: user.bio,
          avatar: getAvatarUrl(user),
          date_created: user.date
        },
        post_id: comment.post_id,
        comment: comment.content,
        replies: replies, 
        date_created: comment.date
      });
    }

    var liked = [];
    for (const user_liked of db.prepare("SELECT * FROM likes WHERE post_id = ?").all(post.id)) {
      const user_here = db.prepare("SELECT * FROM users WHERE id = ?").get(user_liked.user_id);
      liked.push({
        id: user_here.id,
        username: user_here.username,
        bio: user_here.bio,
        avatar: getAvatarUrl(user_here),
        date_created: user_here.date
      });
    }

    response.push({
      id: post.id,
      user: {
        id: user.id,
        username: user.username,
        bio: user.bio,
        avatar: getAvatarUrl(user),
        date_created: user.date
      },
      title: post.title,
      content: post.content,
      likes: liked,
      comments: comments,
      date_created: post.date
    });
  }
  res.status(200).json(response);
});

module.exports = router;

// notifications
// get list of all users

// future for api: random ids for some things?
