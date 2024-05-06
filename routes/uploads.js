import path from "path";
import express from "express";

const router = express();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  // Send the image file
  res.sendFile(filePath);
});

export { router }