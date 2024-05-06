import 'express-async-errors';
import winston, { ExceptionHandler } from 'winston';
import 'winston-mongodb';

export const logger = winston.createLogger({transports: [ new winston.transports.File({ filename: 'logfile.log' })]});

export default function() {
    const logger = winston.createLogger({transports: [ new winston.transports.File({ filename: 'logfile.log' })]});
    process.on('unhandledRejection', (ex) => {
        logger.error('WE GOT AN UNHANDLED REJECTION.');
        throw ex;
      })
      
      
      const handleException = new ExceptionHandler(logger);
      handleException.handle([new winston.transports.File({ filename: 'logfile.log' })],
      [new winston.transports.Console({colorize: true, prettyPrint: true})]);
      // winston.add(new winston.transports.MongoDB({ db: 'mongodb://0.0.0.0:27017/portfolioErrors'}));
}

