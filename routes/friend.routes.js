const express = require("express");

const {
  addFriend,
  addFriendByUsername,
  removeFriend,
  showFriendsPage,
} = require("../controllers/friend.controller");
const { protegerRuta } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/friends", protegerRuta, showFriendsPage);
router.post("/friends", protegerRuta, addFriendByUsername);
router.post("/friends/:userId/add", protegerRuta, addFriend);
router.post("/friends/:userId/remove", protegerRuta, removeFriend);

module.exports = router;
