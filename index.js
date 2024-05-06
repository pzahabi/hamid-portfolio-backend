import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);
import express from 'express';
import logging, { logger } from "./startup/logging.js";
import config from "./startup/config.js";
import { DataBaseConnection } from "./startup/db.js";
import dbSeeder from "./startup/dbSeeder.js";
import routes from "./startup/routes.js";
import prod from "./startup/prod.js";

logging();
config();
await DataBaseConnection.connect();
await dbSeeder();
const app = express();

routes(app);
prod(app);

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));