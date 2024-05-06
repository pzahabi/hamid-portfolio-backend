import { JoiWithVideo } from "../custom-modules/joiWithExtensions.js";
import Joi from "joi";
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  persianTitle: {
    type: String,
    required: true,
    minlength: 3,
  },
  artist: {
    type: String,
    required: true,
    default: "Hamid Shojaei",
    minlength: 3,
    maxlength: 255,
  },
  persianArtist: {
    type: String,
    required: true,
    default: "حمید شجاعی",
    minlength: 3,
    maxlength: 255,
  },
  producer: {
    type: String,
    required: true,
    default: "Hamid Shojaei",
    minlength: 3,
    maxlength: 255,
  },
  persianProducer: {
    type: String,
    required: true,
    default: "حمید شجاعی",
    minlength: 3,
    maxlength: 255,
  },
  video: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const MusicVideo = mongoose.model("MusicVideo", videoSchema);

function validateMusicVideo(video) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    persianTitle: Joi.string().min(3).required(),
    artist: Joi.string().min(3).max(255).required(),
    persianArtist: Joi.string().min(3).max(255).required(),
    producer: Joi.string().min(3).max(255).required(),
    persianProducer: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(video);
}
function validateMusicVideoPut(video) {
  const schema = Joi.object({
    title: Joi.string().min(3),
    persianTitle: Joi.string().min(3),
    artist: Joi.string().min(3).max(255),
    persianArtist: Joi.string().min(3).max(255),
    producer: Joi.string().min(3).max(255),
    persianProducer: Joi.string().min(3).max(255),
    video: Joi.string()
  });

  return schema.validate(video);
}

function validateUploadedVideo(video) {
  const schema = JoiWithVideo.video().required();

  return schema.validate(video);
}

export { MusicVideo, validateMusicVideo, validateUploadedVideo, validateMusicVideoPut };
