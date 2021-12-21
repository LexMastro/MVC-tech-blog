const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            comment: req.body.newComment,
            post_id: req.body.postId,
            user_id: req.session.user_id,
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete comment
router.delete("/:id", withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: "No comment found with this id!" });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update new comment
router.put("/:id", withAuth, async (req, res) => {
    try {
        const updatedComment = await Comment.update(
            {
                comment: req.body.comment,
            },
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id,
                },
            }
        );

        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;