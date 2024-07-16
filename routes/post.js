const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const postController = require("../controllers/post");
const upload = require("../middleware/multer");

router.get("/", postController.get_posts);
router.get("/:id", auth, postController.get_post);
router.post("/", auth, upload.single("image"), postController.post_post);
router.put("/:id", auth, upload.single("image"), postController.put_post);
router.delete("/:id", auth, postController.delete_post);
router.post("/:id/review", auth, postController.post_review);
router.delete("/:id/review/:reviewId", auth, postController.delete_review);

module.exports = router;
