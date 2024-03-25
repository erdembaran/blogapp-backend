const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const emailService = require("../helpers/send-mail");
const { User, validateRegister, validateLogin } = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

exports.get_users = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (error) {
    console.log(error);
  }
};

exports.post_register = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send("user already registered.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await user.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.header("x-auth-token", token).send(newUser);
  } catch (error) {
    console.log(error);
  }
};

exports.post_login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(400).send("invalid password or email!");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.status(400).send("invalid password or email!");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.send(token);
  } catch (error) {
    console.log(error);
  }
};

exports.post_forgot_password = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("user not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;

    await user.save();

    emailService.sendMail({
      from: process.env.SMTP_USERNAME,
      to: user.email,
      subject: "Reset Password",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://127.0.0.1:3000/reset-password/${resetToken}>Reset Password</a> to set a new password</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      `,
    });

    res.status(200).send("reset link sent to your email.");
  } catch (error) {
    console.log(error);
  }
};

exports.put_reset_password = async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("invalid token");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    res.status(200).send("password updated!");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while resetting password.");
  }
};
