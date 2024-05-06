import mongoose from "mongoose";
import 'dotenv/config'

// const mongoUri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}?authSource=admin`;
const mongoUri = `mongodb://0.0.0.0:27017/portfolio`;

export class DataBaseConnection {
  static async connect() {
    mongoose.connect(mongoUri)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
      });
  }
}
