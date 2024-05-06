import { User, validateUser as validate } from "../models/user.js";
import auth from "../middleware/auth.js";
import Joi from "joi";
import _ from "lodash";
import * as bcrypt from "bcrypt";
import express from "express";
const router = express();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "username", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();
  const token = user.generateToken();
  res.header("token", token).send(_.pick(user, ["_id", "name", "username"]));
});

router.put("/", async (req, res) => {
  const { error } = validateNew(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.oldUsername });
  if (!user) return res.status(400).send("Invalid Username or Password");

  const isValid = bcrypt.compare(req.body.oldPassword, user.password);
  if (!isValid) return res.status(400).send("Invalid Username or Password");

  const salt = await bcrypt.genSalt(10);
  
  const newUser = {
    username: req.body.newUsername,
    password: await bcrypt.hash(req.body.newPassword, salt)
  }

  user = await User.findByIdAndUpdate(user._id, newUser, {
    new: true,
  });

  const token = user.generateToken();
  res.set({'Access-Control-Expose-Headers': 'token',"token": token}).send(_.pick(user, ["_id", "name", "username"]));
});

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

const validateNew = (user) => {
  const schema = Joi.object({
    oldUsername: Joi.string().min(5).max(255).required(),
    oldPassword: Joi.string().min(8).max(50).required(),
    newUsername: Joi.string().min(5).max(255).required(),
    newPassword: Joi.string().min(8).max(50).required(),
  });
  return schema.validate(user);
};

export { router };
