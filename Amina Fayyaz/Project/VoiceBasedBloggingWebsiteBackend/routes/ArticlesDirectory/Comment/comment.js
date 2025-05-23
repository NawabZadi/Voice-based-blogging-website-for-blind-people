const express = require ("express");
const { body } = require("express-validator/check");
const isAuth = require("../../../middleware/is-auth");
const commentController = require("../../../controllers/ArticlesDirectory/Comment/comment");
const router = express.Router();


router.get("/get-blog-comments/:articleId", commentController.getArticleCommentsWithReplies);

router.post("/comment/add-new",
    isAuth,
    [
        body("text")
            .trim()
            .not()
            .isEmpty()
    ],commentController.addNewComment);

router.delete("/comment/delete",
    isAuth,commentController.deleteComment);

router.put ("/comment/edit",
    isAuth,
    [
        body("text")
        .trim()
        .not()
        .isEmpty()
    ],commentController.editComment);

router.post("/comment/like",
    isAuth,commentController.likeComment);

//router.post("/comment/unlike",commentController.unlikeComment);


module.exports = router;