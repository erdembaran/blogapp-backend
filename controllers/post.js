const { Post, validatePost } = require("../models/post");
const { post_register } = require("./user");

exports.get_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

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
    const posts = await Post.find();

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

    const post = new Post({
      title: req.body.title,
      description: req.body.description,
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

    post.title = req.body.title;
    post.description = req.body.description;

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

    res.send(post);
  } catch (error) {
    console.log(error);
  }
};
