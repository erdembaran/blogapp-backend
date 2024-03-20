const bcrypt = require("bcrypt");
const { User, validateRegister, validateLogin } = require("../modules/user");

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

    res.send(newUser);
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
  } catch (error) {
    console.log(error);
  }
};
