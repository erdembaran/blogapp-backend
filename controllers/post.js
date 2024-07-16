const mongoose = require("mongoose");
const { Post, validatePost, validateReview } = require("../models/post");
const cloudinary = require("../config/cloudinary");

exports.get_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email -_id"
    );

    if (!post) {
      return res.status(404).send("post not found.");
    }

    res.send(post);
  } catch (error) {
    console.log(error);
  }
};

exports.get_posts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email -_id");

    res.send(posts);
  } catch (error) {
    console.log(error);
  }
};

exports.post_post = async (req, res) => {
  try {
    const { error } = validatePost(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image: {
        publicId: result.public_id,
        url: result.secure_url,
      },
      author: req.user.id,
      likes: req.body.likes,
      reviews: req.body.reviews,
    });

    const newPost = await post.save();

    res.send(newPost);
  } catch (error) {
    console.log(error);
  }
};

exports.put_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("post not found.");
    }

    const { error } = validatePost(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    await cloudinary.uploader.destroy(post.image.publicId);
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    post.image.publicId = result.public_id;
    post.image.url = result.secure_url;
    post.title = req.body.title;
    post.content = req.body.content;

    const updatedPost = await post.save();

    res.send(updatedPost);
  } catch (error) {
    console.log(error);
  }
};

exports.delete_post = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).send("post not found.");
    }

    await cloudinary.uploader.destroy(post.image.publicId);

    res.send({
      message: "post deleted successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.post_review = async (req, res) => {
  try {
    const { error } = validateReview(req.body.reviews[0]);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const review = {
      user: req.user.id,
      comment: req.body.reviews[0].comment,
    };

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("post not found.");
    }

    post.reviews.push(review);

    await post.save();

    const populatedPost = await Post.findById(req.params.id)
      .populate("author", "name email -_id")
      .populate("reviews.user", "name email -_id");

    res.status(200).send(populatedPost);
  } catch (error) {
    console.log(error);
  }
};

exports.delete_review = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Post not found!");
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) {
      return res.status(400).send("Comment not found!");
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("post not found.");
    }

    post.reviews.id(req.params.reviewId).deleteOne();

    await post.save();

    res.send({
      message: "comment deleted successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};
