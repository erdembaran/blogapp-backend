const { mongoose, Schema } = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        comment: {
          type: String,
          required: true,
        },

        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

function validatePost(user) {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(10).required(),
    likes: Joi.number(),
  });

  return schema.validate(user);
}

function validateReview(review) {
  const schema = Joi.object({
    comment: Joi.string().min(1).required(),
  });

  return schema.validate(review);
}

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, validatePost, validateReview };
