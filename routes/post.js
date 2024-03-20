const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

router.get("/", postController.get_posts);
router.get("/:id", postController.get_post);
router.post("/", postController.post_post);
router.put("/:id", postController.put_post);
router.delete("/:id", postController.delete_post);

module.exports = router;
