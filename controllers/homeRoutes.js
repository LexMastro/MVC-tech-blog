const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // Get all comment and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/dashboard", async (req, res) => {
  res.render("dashboard", {
    logged_in: req.session.user_id,
  });
});

// Edit post route
router.get("/post/:id/edit", async (req, res) => {
  try {
    // Get post by id and JOIN with user data
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });
    const post = postData.get({ plain: true });
    res.render("postupdate", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create post route
router.get("/post/:id", async (req, res) => {
  let userId = req.session.user_id;
  // Get post by id and JOIN with user and comment data
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
        // Comment table JOIN with User to get username
        { model: Comment, include: [{ model: User }] },
      ],
    });

    const post = postData.get({ plain: true });

    res.render("post", {
      ...post,
      logged_in: req.session.logged_in,
      uid: userId,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    console.log(postData);
    const post = postData.get({ plain: true });

    res.render("post", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

//Able to add comments
router.get("/comment/:id", async (req, res) => {
  console.log();
  let userId = req.session.user_id;
  // Get article by id and JOIN wit user and comment data
  try {
    const commentData = await Comment.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
        // Comment table JOIN with User to get username
        { model: Comment, include: [{ model: User }] },
      ],
    });

    const comments = commentData.get({ plain: true });
    console.log(comments);

    res.render("comments", {
      layout: "beautyboard",
      ...comments,
      logged_in: req.session.logged_in,
      uid: userId,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
