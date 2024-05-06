import { User } from "../models/user.js";
import Joi from "joi";
import _ from "lodash";
import * as bcrypt from "bcrypt";
import express from "express";
const router = express();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid Username or Password");

  const isValid = bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid Username or Password");

  const token = user.generateToken();
  res.set({'Access-Control-Expose-Headers': 'token',"token": token}).send(_.pick(user, ["_id", "name", "username"]));
});

const validate = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(50).required(),
  });
  return schema.validate(user);
};

export { router };
