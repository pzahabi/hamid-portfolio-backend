import Joi from 'joi';

const JoiWithAudio = Joi.extend((Joi) => ({
  type: 'audio',
  base: Joi.string(),
  messages: {
    'audio.invalidType': '{{#label}} must be an audio file of type: {{#formats}}',
  },
  rules: {
    audio: {
      validate(params, value, state, options) {
        const allowedFormats = (
          params.formats || ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
        ).join(', ');

        if (!value.match(new RegExp(`\\.(${allowedFormats})$`, 'i'))) {
          return this.createError(
            'audio.invalidType',
            { v: value, formats: allowedFormats },
            state,
            options
          );
        }

        return value;
      },
    },
    
  },
}));
const JoiWithImage = Joi.extend((Joi) => ({
  type: 'image',
  base: Joi.string(),
  messages: {
    'image.invalidType': '{{#label}} must be an audio file of type: {{#formats}}',
  },
  rules: {
    image: {
      validate(params, value, state, options) {
        const allowedFormats = (
          params.formats || [
            'jpeg',
            'jpg',
            'png',
            'gif',
            'bmp',
            'tiff',
            'webp',
            'svg',
            'ico',
          ]
        ).join(', ');
    
        if (!value.match(new RegExp(`\\.(${allowedFormats})$`, 'i'))) {
          return this.createError(
            'image.invalidType',
            { v: value, formats: allowedFormats },
            state,
            options
          );
        }
    
        return value;
      },
    },
    
  },
}));
const JoiWithVideo = Joi.extend((Joi) => ({
  type: 'video',
  base: Joi.string(),
  messages: {
    'video.invalidType': '{{#label}} must be an audio file of type: {{#formats}}',
  },
  rules: {
    video: {
      validate(params, value, state, options) {
        const allowedFormats = (
          params.formats || ['mp4', 'mkv', 'avi', 'mov']
        ).join(', ');
    
        if (!value.match(new RegExp(`\\.(${allowedFormats})$`, 'i'))) {
          return this.createError(
            'multimedia.invalidType',
            { v: value, formats: allowedFormats },
            state,
            options
          );
        }
    
        return value;
      },
    },
  },
}));




export { JoiWithAudio, JoiWithImage, JoiWithVideo };