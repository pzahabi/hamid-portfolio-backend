import {
  Track,
  validateTrack,
  validateImage,
  validateAudio,
  validateTrackPut,
} from "../models/track.js";
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
  const tracks = await Track.find().sort("-date");

  res.send(tracks);
});

router.post(
  "/",
  [
    auth,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    const { error } =
      validateTrack(req.body) ||
      validateImage(req.files["image"][0]) ||
      validateAudio(req.files["audio"][0]);
    if (error) return res.status(400).send(error.details[0].message);

    let track = new Track({
      title: req.body.title,
      persianTitle: req.body.persianTitle,
      artist: req.body.artist,
      persianArtist: req.body.persianArtist,
      producer: req.body.producer,
      persianProducer: req.body.persianProducer,
      image: req.files["image"][0].path,
      audio: req.files["audio"][0].path,
    });
    track = await track.save();

    res.send(track);
  }
);

router.put("/:id", [auth, fileUpload()], async (req, res) => {
  const { error } = validateTrackPut(req.body);
  if (error) return res.status(400).send(error.details[0].message);

    const existingTrack = await Track.findById(req.params.id);

    // Update properties based on the request body
    const updatedTrack = {
      title: req.body.title || existingTrack.title,
      persianTitle: req.body.persianTitle || existingTrack.persianTitle,
      artist: req.body.artist || existingTrack.artist,
      persianArtist: req.body.persianArtist || existingTrack.persianArtist,
      producer: req.body.producer || existingTrack.producer,
      persianProducer:
        req.body.persianProducer || existingTrack.persianProducer,
    };

    const currentDir = process.cwd();
    const uploadsDir = path.join(currentDir, "uploads");

    // Check if files were uploaded
    if (req.files) {
      // Validate and move image if provided
      if (req.files.image) {
        const imageDestination = path.join(uploadsDir, req.files.image.name);
        const { error } = validateImage(req.files.image.name);
        if (error) return res.status(400).send(error.details[0].message);
        await req.files.image.mv(imageDestination, (err) => {
          if (err) {
            logger.error(err);
          }
        });
        updatedTrack.image = path.join("uploads", req.files.image.name);
        const imagePath = path.join(process.cwd(), existingTrack.image);
        fs.unlink(imagePath);
      }

      // Validate and move audio if provided
      if (req.files.audio) {
        const { error } = validateAudio(req.files.audio.name);
        if (error) return res.status(400).send(error.details[0].message);
        const audioDestination = path.join(uploadsDir, req.files.audio.name);
        await req.files.audio.mv(audioDestination, (err) => {
          if (err) {
            logger.error(err);
          }
        });
        updatedTrack.audio = path.join("uploads", req.files.audio.name);
        const audioPath = path.join(process.cwd(), existingTrack.audio);
        fs.unlink(audioPath);
      }
    }

    // Update the track
    const track = await Track.findByIdAndUpdate(req.params.id, updatedTrack, {
      new: true,
    });

    if (!track)
      return res.status(404).send("The track with the given ID was not found.");

    res.send(track);
});

router.delete("/:id", auth, async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track)
    return res.status(404).send("The track with the given ID was not found.");

  const imagePath = path.join(process.cwd(), track.image);
  const audioPath = path.join(process.cwd(), track.audio);

  // Use Promise.all to wait for both file deletions to complete
  await Promise.all([fs.unlink(imagePath), fs.unlink(audioPath)]);

  await track.deleteOne();

  res.send(track);
});

router.get("/:id", async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (!track)
    return res.status(404).send("The track with the given ID was not found.");

  res.send(track);
});

export { router };
