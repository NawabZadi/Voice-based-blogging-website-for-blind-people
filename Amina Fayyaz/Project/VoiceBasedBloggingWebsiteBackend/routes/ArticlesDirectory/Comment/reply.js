const express = require("express");
const { body } = require("express-validator/check");
const isAuth =require("../../../middleware/is-auth");
const commentReplyController = require("../../../controllers/ArticlesDirectory/Comment/reply");
const router = express.Router();

router.post("/reply/add",
    isAuth,
    [
        body("text")
        .trim()
        .not()
        .isEmpty()
    ], commentReplyController.addNewReply);

router.delete("/reply/delete",
    isAuth,commentReplyController.deleteReply);

router.put("/reply/edit",
    isAuth,
    [
        body("text")
        .trim()
        .not()
        .isEmpty()   
    ], commentReplyController.editReply);

router.post("/reply/like",
    isAuth, commentReplyController.likeReply);


module.exports = router;