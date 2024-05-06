import { JoiWithImage } from "../custom-modules/joiWithExtensions.js";
import Joi from "joi";
import mongoose from "mongoose";

const coWorkerSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    minlength: 3,
  },
  persianDescription: {
    type: String,
    required: true,
    minlength: 3,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const CoWorker = mongoose.model("CoWorker", coWorkerSchema);

function validateCoWorker(coWorker) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    persianTitle: Joi.string().min(3).required(),
    artist: Joi.string().min(3).max(255).required(),
    persianArtist: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).required(),
    persianDescription: Joi.string().min(3).required(),
  });

  return schema.validate(coWorker);
}
function validateCoWorkerPut(coWorker) {
  const schema = Joi.object({
    title: Joi.string(),
    persianTitle: Joi.string(),
    artist: Joi.string().max(255),
    persianArtist: Joi.string().max(255),
    description: Joi.string(),
    persianDescription: Joi.string(),
    image: Joi.string(),
  });

  return schema.validate(coWorker);
}

function validateImage(image) {
  const schema = JoiWithImage.image().required();

  return schema.validate(image);
}

export { CoWorker, validateCoWorker, validateCoWorkerPut, validateImage };