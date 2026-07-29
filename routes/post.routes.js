const express = require("express");

const {
  showWritePage,
  createPost,
  listPosts,
  addComment,
} = require("../controllers/post.controller");

const { protegerRuta } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/write", protegerRuta, showWritePage);
router.post("/write", protegerRuta, createPost);
router.get("/posts", listPosts);
router.post("/posts/:postId/comments", addComment);

module.exports = router;
