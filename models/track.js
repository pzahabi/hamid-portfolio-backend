import { JoiWithAudio, JoiWithImage } from "../custom-modules/joiWithExtensions.js";
import Joi from "joi";
import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Track = mongoose.model("Track", trackSchema);

function validateTrack(track) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    persianTitle: Joi.string().min(3).required(),
    artist: Joi.string().min(3).max(255).required(),
    persianArtist: Joi.string().min(3).max(255).required(),
    producer: Joi.string().min(3).max(255).required(),
    persianProducer: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(track);
}
function validateTrackPut(track) {
  const schema = Joi.object({
    title: Joi.string(),
    persianTitle: Joi.string(),
    artist: Joi.string().max(255),
    persianArtist: Joi.string().max(255),
    producer: Joi.string().max(255),
    persianProducer: Joi.string().max(255),
    image: Joi.string(),
    audio: Joi.string(),
  });

  return schema.validate(track);
}

function validateImage(image) {
  const schema = JoiWithImage.image().required();

  return schema.validate(image);
}

function validateAudio(audio) {
  const schema = JoiWithAudio.audio().required();

  return schema.validate(audio);
}

export {
  Track,
  validateTrack,
  validateImage,
  validateAudio,
  validateTrackPut
};
