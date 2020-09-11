import {createStream} from 'rotating-file-stream';
import path from 'path';
import morgan from 'morgan';
import {Express} from 'express';

const logStream = createStream('http.log', {
  interval: '1d',
  path: path.join(__dirname, '../logs'),
  compress: 'gzip',
  maxSize: '5M'
});

export default (app: Express) => {
  // Write logs in /logs/http.log
  app.use(morgan('combined', {stream: logStream}));
  // Write the logs in the console
  app.use(morgan('combined'));
};
