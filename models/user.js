const { mongoose, Schema } = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      requires: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: Boolean,
  },
  { timestamps: true }
);

function validateRegister(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports = { User, validateRegister, validateLogin };
