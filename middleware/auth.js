import c from "config";
import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).send("Access denied.");

  try {
    const decoded = jwt.verify(token, c.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
}
