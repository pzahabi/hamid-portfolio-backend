import auth from "../middleware/auth.js";
import express from "express";
const router = express();

router.post('/', auth, (req, res) => {
    res.send('authenticated');
});

export { router };