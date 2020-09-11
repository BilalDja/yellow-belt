import bodyParser from 'body-parser';
import userRouter from './routes/user';
import express from 'express';
import morgan from './config/morgan';
import db from './config/db';
import './config/passport';

const main = () => {
  // Database configuration
  db();
  const app = express();
  // Morgan configuration (logging)
  morgan(app);
  // extracting json data from requests body parse it and put it in req.body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  // attaching users endpoints (routes)
  app.use('/api/v1/users', userRouter);

  app.get('/', (_, res) => {
    res.send('<h1>Yellow Belt, ⭐!</h1>');
  });

  app.listen(process.env.PORT, () => {
    app.emit('started');
    console.log(`Server running on http://127.0.0.1/${process.env.PORT}`);
  });
  return app;
};
// this line is to prevent the app to run twice while testing
if (!module.parent) {
  main();
}
// export the main function to launch it on command in the tests
export default main;
