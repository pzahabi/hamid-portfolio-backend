import {
    CoWorker,
    validateCoWorker,
    validateCoWorkerPut,
    validateImage,
  } from "../models/coWorker.js";
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
    const coWorkers = await CoWorker.find().sort("-date");
  
    res.send(coWorkers);
  });
  
  router.post(
    "/",
    [
      auth,
      upload.fields([
        { name: "image", maxCount: 1 },
      ]),
    ],
    async (req, res) => {
      const { error } =
        validateCoWorker(req.body) ||
        validateImage(req.files["image"][0]);
      if (error) return res.status(400).send(error.details[0].message);
  
      let coWorker = new CoWorker({
        title: req.body.title,
        persianTitle: req.body.persianTitle,
        artist: req.body.artist,
        persianArtist: req.body.persianArtist,
        description: req.body.description,
        persianDescription: req.body.persianDescription,
        image: req.files["image"][0].path,
      });
      coWorker = await coWorker.save();
  
      res.send(coWorker);
    }
  );
  
  router.put("/:id", [auth, fileUpload()], async (req, res) => {
    const { error } = validateCoWorkerPut(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
      const existingCoWorker = await CoWorker.findById(req.params.id);
  
      // Update properties based on the request body
      const updatedCoWorker = {
        title: req.body.title || existingCoWorker.title,
        persianTitle: req.body.persianTitle || existingCoWorker.persianTitle,
        artist: req.body.artist || existingCoWorker.artist,
        persianArtist: req.body.persianArtist || existingCoWorker.persianArtist,
        description: req.body.description || existingCoWorker.description,
        persianDescription: req.body.persianDescription || existingCoWorker.persianDescription,
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
          updatedCoWorker.image = path.join("uploads", req.files.image.name);
          const imagePath = path.join(process.cwd(), existingCoWorker.image);
          fs.unlink(imagePath);
        }}
  
      // Update the track
      const coWorker = await CoWorker.findByIdAndUpdate(req.params.id, updatedCoWorker, {
        new: true,
      });
  
      if (!coWorker)
        return res.status(404).send("The co-worker with the given ID was not found.");
  
      res.send(coWorker);
  });
  
  router.delete("/:id", auth, async (req, res) => {
    const coWorker = await CoWorker.findById(req.params.id);
  
    if (!coWorker)
      return res.status(404).send("The co-worker with the given ID was not found.");
  
    const imagePath = path.join(process.cwd(), coWorker.image);
  
    // Use Promise.all to wait for both file deletions to complete
    await fs.unlink(imagePath);
  
    await coWorker.deleteOne();
  
    res.send(coWorker);
  });
  
  router.get("/:id", async (req, res) => {
    const coWorker = await CoWorker.findById(req.params.id);
  
    if (!coWorker)
      return res.status(404).send("The co-worker with the given ID was not found.");
  
    res.send(coWorker);
  });
  
  export { router };
  