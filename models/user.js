import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import c from "config";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    username: {
        type: String,
        required: true,
        uniqe: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    }
})

userSchema.methods.generateToken = function() {
    const token = jwt.sign({ _id: this._id, username: this.username}, c.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        username: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).max(50).required()
    })
    return schema.validate(user);
}

export { User, validateUser};