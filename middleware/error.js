import { logger } from "../startup/logging.js";

export default function(err, req, res, next) {
    logger.error(err.message, {metadata: err});
    res.status(500).send('Somthing failed.');
}