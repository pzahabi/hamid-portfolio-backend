import { router as tracks } from "../routes/tracks.js";
import { router as musicVideos } from "../routes/musicVideos.js";
import { router as coWorkers } from "../routes/coWorkers.js";
import { router as users } from "../routes/users.js";
import { router as login } from "../routes/login.js";
import { router as uploads } from "../routes/uploads.js";
import { router as auth } from "../routes/auth.js";
import error from "../middleware/error.js";
import cors from "cors";
import express from "express";

export default function (app) {
  app.use(cors());

  app.use(express.json());

  app.use("/api/tracks", tracks);
  app.use("/api/musicvideos", musicVideos);
  app.use("/api/coworkers", coWorkers);
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/auth", auth);
  app.use("/api/uploads", uploads);

  app.use(error);
}
