const { isValidObjectId } = require("mongoose");

const { estaAutenticado } = require("../middlewares/auth.middleware");
const Post = require("../models/Post");

async function renderPostsPage(req, res, statusCode = 200, extraData = {}) {
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  return res.status(statusCode).render("posts", {
    title: "Publicaciones recientes",
    posts,
    isAuthenticated: estaAutenticado(req),
    commentError: null,
    commentErrorPostId: null,
    commentFormData: {},
    ...extraData,
  });
}

exports.showWritePage = (req, res) => {
  res.render("write", {
    title: "Crear publicación",
    error: null,
    formData: {},
  });
};

exports.createPost = async (req, res) => {
  try {
    const author = req.body.author?.trim();
    const content = req.body.content?.trim();

    if (!author || !content) {
      return res.status(400).render("write", {
        title: "Crear publicación",
        error: "Debes escribir el usuario y la publicación.",
        formData: {
          author,
          content,
        },
      });
    }

    await Post.create({
      author,
      content,
    });

    return res.redirect("/posts");
  } catch (error) {
    console.error("Error guardando publicación:", error);

    return res.status(500).render("write", {
      title: "Crear publicación",
      error: "No se pudo guardar la publicación.",
      formData: req.body,
    });
  }
};

exports.listPosts = async (req, res) => {
  try {
    return renderPostsPage(req, res);
  } catch (error) {
    console.error("Error consultando publicaciones:", error);

    return res.status(500).send("No se pudieron cargar las publicaciones.");
  }
};

exports.addComment = async (req, res) => {
  const postId = req.params.postId;
  const author = req.body.author?.trim();
  const content = req.body.content?.trim();

  try {
    if (!isValidObjectId(postId)) {
      return res.status(404).send("La publicación no existe.");
    }

    if (!author || !content) {
      return renderPostsPage(req, res, 400, {
        commentError: "Debes escribir tu nombre y el comentario.",
        commentErrorPostId: postId,
        commentFormData: {
          author,
          content,
        },
      });
    }

    if (author.length > 80 || content.length > 300) {
      return renderPostsPage(req, res, 400, {
        commentError: "El comentario supera el límite permitido.",
        commentErrorPostId: postId,
        commentFormData: {
          author,
          content,
        },
      });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            author,
            content,
          },
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!post) {
      return res.status(404).send("La publicación no existe.");
    }

    return res.redirect("/posts#post-" + postId);
  } catch (error) {
    console.error("Error guardando comentario:", error);

    return res.status(500).send("No se pudo guardar el comentario.");
  }
};
