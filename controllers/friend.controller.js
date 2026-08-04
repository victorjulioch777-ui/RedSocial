const { isValidObjectId } = require("mongoose");

const testUser = require("../config/testUser");
const Post = require("../models/Post");
const User = require("../models/User");
const { normalizeUsername } = require("../models/User");

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCurrentUsername() {
  return testUser.usuario;
}

async function ensureUser(username) {
  const cleanUsername = String(username || "").trim();
  const normalizedUsername = normalizeUsername(cleanUsername);

  if (!normalizedUsername) {
    return null;
  }

  return User.findOneAndUpdate(
    { normalizedUsername },
    {
      $setOnInsert: {
        username: cleanUsername,
        normalizedUsername,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    },
  );
}

function getUserIdList(values) {
  return values
    .filter(Boolean)
    .map((value) => String(value._id || value));
}

async function syncUsersFromPosts() {
  const posts = await Post.find().select("author comments.author").lean();
  const usernames = new Set();

  posts.forEach((post) => {
    if (post.author) {
      usernames.add(post.author);
    }

    const comments = Array.isArray(post.comments) ? post.comments : [];

    comments.forEach((comment) => {
      if (comment.author) {
        usernames.add(comment.author);
      }
    });
  });

  await Promise.all([...usernames].map((username) => ensureUser(username)));
}

function getStatusMessage(query) {
  const statusMessages = {
    added: "Amigo agregado correctamente.",
    removed: "Amigo eliminado correctamente.",
    already: "Ese usuario ya está en tu lista de amigos.",
    created: "Perfil encontrado y agregado a tus amigos.",
  };

  const errorMessages = {
    invalid: "No se pudo encontrar ese usuario.",
    self: "No puedes agregarte a ti mismo.",
    username: "Escribe un nombre de usuario válido.",
  };

  if (query.status && statusMessages[query.status]) {
    return {
      type: "success",
      text: statusMessages[query.status],
    };
  }

  if (query.error && errorMessages[query.error]) {
    return {
      type: "error",
      text: errorMessages[query.error],
    };
  }

  return null;
}

async function getFriendsPageData(req, extraData = {}) {
  await syncUsersFromPosts();

  const currentUser = await ensureUser(getCurrentUsername());
  const currentUserData = await User.findById(currentUser._id)
    .populate("friends")
    .lean();

  const friends = (currentUserData.friends || []).filter(Boolean);
  const friendIds = new Set(getUserIdList(friends));
  const search = String(req.query.q || "").trim();
  const userFilters = {
    _id: {
      $ne: currentUser._id,
    },
  };

  if (search) {
    userFilters.username = {
      $regex: escapeRegExp(search),
      $options: "i",
    };
  }

  const users = await User.find(userFilters).sort({ username: 1 }).lean();
  const suggestedUsers = users.map((user) => ({
    ...user,
    isFriend: friendIds.has(String(user._id)),
  }));

  return {
    title: "Amigos",
    currentUser: currentUserData,
    friends,
    suggestedUsers,
    search,
    message: getStatusMessage(req.query),
    formData: {},
    ...extraData,
  };
}

async function renderFriendsPage(req, res, statusCode = 200, extraData = {}) {
  const data = await getFriendsPageData(req, extraData);

  return res.status(statusCode).render("friends", data);
}

exports.showFriendsPage = async (req, res) => {
  try {
    return renderFriendsPage(req, res);
  } catch (error) {
    console.error("Error cargando amigos:", error);
    return res.status(500).send("No se pudo cargar la página de amigos.");
  }
};

exports.addFriendByUsername = async (req, res) => {
  const username = String(req.body.username || "").trim();
  const normalizedUsername = normalizeUsername(username);

  try {
    if (!normalizedUsername || username.length > 80) {
      return renderFriendsPage(req, res, 400, {
        message: {
          type: "error",
          text: "Escribe un nombre de usuario válido.",
        },
        formData: {
          username,
        },
      });
    }

    const currentUser = await ensureUser(getCurrentUsername());

    if (normalizedUsername === currentUser.normalizedUsername) {
      return res.redirect("/friends?error=self");
    }

    const friendUser = await ensureUser(username);
    const alreadyFriend = currentUser.friends.some(
      (friendId) => String(friendId) === String(friendUser._id),
    );

    if (alreadyFriend) {
      return res.redirect("/friends?status=already");
    }

    await Promise.all([
      User.findByIdAndUpdate(currentUser._id, {
        $addToSet: {
          friends: friendUser._id,
        },
      }),
      User.findByIdAndUpdate(friendUser._id, {
        $addToSet: {
          friends: currentUser._id,
        },
      }),
    ]);

    return res.redirect("/friends?status=created");
  } catch (error) {
    console.error("Error agregando amigo por usuario:", error);
    return res.status(500).send("No se pudo agregar el amigo.");
  }
};

exports.addFriend = async (req, res) => {
  const friendId = req.params.userId;

  try {
    if (!isValidObjectId(friendId)) {
      return res.redirect("/friends?error=invalid");
    }

    const currentUser = await ensureUser(getCurrentUsername());
    const friendUser = await User.findById(friendId);

    if (!friendUser) {
      return res.redirect("/friends?error=invalid");
    }

    if (String(currentUser._id) === String(friendUser._id)) {
      return res.redirect("/friends?error=self");
    }

    const alreadyFriend = currentUser.friends.some(
      (currentFriendId) => String(currentFriendId) === String(friendUser._id),
    );

    if (alreadyFriend) {
      return res.redirect("/friends?status=already");
    }

    await Promise.all([
      User.findByIdAndUpdate(currentUser._id, {
        $addToSet: {
          friends: friendUser._id,
        },
      }),
      User.findByIdAndUpdate(friendUser._id, {
        $addToSet: {
          friends: currentUser._id,
        },
      }),
    ]);

    return res.redirect("/friends?status=added");
  } catch (error) {
    console.error("Error agregando amigo:", error);
    return res.status(500).send("No se pudo agregar el amigo.");
  }
};

exports.removeFriend = async (req, res) => {
  const friendId = req.params.userId;

  try {
    if (!isValidObjectId(friendId)) {
      return res.redirect("/friends?error=invalid");
    }

    const currentUser = await ensureUser(getCurrentUsername());
    const friendUser = await User.findById(friendId);

    if (!friendUser) {
      return res.redirect("/friends?error=invalid");
    }

    await Promise.all([
      User.findByIdAndUpdate(currentUser._id, {
        $pull: {
          friends: friendUser._id,
        },
      }),
      User.findByIdAndUpdate(friendUser._id, {
        $pull: {
          friends: currentUser._id,
        },
      }),
    ]);

    return res.redirect("/friends?status=removed");
  } catch (error) {
    console.error("Error eliminando amigo:", error);
    return res.status(500).send("No se pudo eliminar el amigo.");
  }
};
