const { mongoose, Schema } = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

function validatePost(user) {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().min(10).required(),
  });

  return schema.validate(user);
}

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, validatePost };
