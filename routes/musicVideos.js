import {
  MusicVideo,
  validateMusicVideo,
  validateUploadedVideo,
  validateMusicVideoPut,
} from "../models/musicVideo.js";
import { logger } from "../startup/logging.js";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import express from "express";
import fileUpload from "express-fileupload";
import auth from "../middleware/auth.js";

const router = express();
// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Append the file extension to the filename
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Create multer instance
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const musicVideos = await MusicVideo.find().sort("-date");

  res.send(musicVideos);
});

router.post("/", [auth, upload.single("video")], async (req, res) => {
  const { error } =
    validateMusicVideo(req.body) || validateUploadedVideo(req.file);
  if (error) return res.status(400).send(error.details[0].message);

  let musicVideo = new MusicVideo({
    title: req.body.title,
    persianTitle: req.body.persianTitle,
    artist: req.body.artist,
    persianArtist: req.body.persianArtist,
    producer: req.body.producer,
    persianProducer: req.body.persianProducer,
    video: req.file.path,
  });
  musicVideo = await musicVideo.save();

  res.send(musicVideo);
});

// upload.single("video")
router.put("/:id", [auth, fileUpload()], async (req, res) => {
  const { error } = validateMusicVideoPut(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingMusicVideo = await MusicVideo.findById(req.params.id);
  const updatedMusicVideo = await MusicVideo.findByIdAndUpdate(req.params.id, {
    title: req.body.title ? req.body.title : existingMusicVideo.title,
    persianTitle: req.body.persianTitle
      ? req.body.persianTitle
      : existingMusicVideo.persianTitle,
    artist: req.body.artist ? req.body.artist : existingMusicVideo.artist,
    persianArtist: req.body.persianArtist
      ? req.body.persianArtist
      : existingMusicVideo.persianArtist,
    producer: req.body.producer
      ? req.body.producer
      : existingMusicVideo.producer,
    persianProducer: req.body.persianProducer
      ? req.body.persianProducer
      : existingMusicVideo.persianProducer,
  });

  const currentDir = process.cwd();
  const uploadsDir = path.join(currentDir, "uploads");

  if (req.files.video) {
    const videoDestination = path.join(uploadsDir, req.files.video.name);
    const { error } = validateUploadedVideo(req.files.video.name);
    if (error) return res.status(400).send(error.details[0].message);
    await req.files.video.mv(videoDestination, (err) => {
      if (err) {
        logger.error(err);
      }
    });
    updatedMusicVideo.video = path.join("uploads", req.files.video.name);
    const videoPath = path.join(process.cwd(), existingMusicVideo.video);
    fs.unlink(videoPath);
  }

  const musicVideo = await MusicVideo.findByIdAndUpdate(req.params.id, updatedMusicVideo, {
    new: true,
  });

  if (!musicVideo)
    return res
      .status(404)
      .send("The music video with the given ID was not found.");

  res.send(musicVideo);
});

router.delete("/:id", auth, async (req, res) => {
  const musicVideo = await MusicVideo.findById(req.params.id);

  if (!musicVideo)
    return res
      .status(404)
      .send("The music video with the given ID was not found.");

  const videoPath = path.join(process.cwd(), musicVideo.video);

  await fs.unlink(videoPath);

  // logger.error(`Error deleting image file: ${musicVideo.video}`);

  await musicVideo.deleteOne();

  res.send(musicVideo);
});

router.get("/:id", async (req, res) => {
  const musicVideo = await MusicVideo.findById(req.params.id);

  if (!musicVideo)
    return res
      .status(404)
      .send("The music video with the given ID was not found.");

  res.send(musicVideo);
});

export { router };
