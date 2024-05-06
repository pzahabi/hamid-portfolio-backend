import { User } from "../models/user.js";
import { logger } from "./logging.js";
import 'dotenv/config'

export default async function () {
  try {
    const created = await User.findOne({ username: "admin" });
    if (created) return console.log("admin already created!");
    const user = new User({
      name: "حمید شجاعی",
      username: "admin",
      password: process.env.ADMIN_PASS,
    });
    await user.save();
  } catch (err) {
    logger.error(err);
  }
}
