const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const postController = require("../controllers/post");

router.get("/", postController.get_posts);
router.get("/:id", auth, postController.get_post);
router.post("/", auth, postController.post_post);
router.put("/:id", auth, postController.put_post);
router.delete("/:id", auth, postController.delete_post);

module.exports = router;
