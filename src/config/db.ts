import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';

export default () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Fake mongod URI: ', process.env.DATABASE_URL);
  }
  mongoose.connect(String(process.env.DATABASE_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).catch((err: any) => {
    console.log(err);
    throw err;
  });
}
// This configuration suits Windows users, if you are using a different OS please visit mongodb-memory-server for more information for how to configure it for your OS.
export const fakeServer = new MongoMemoryServer({
  binary: {
    arch: 'x64',
    platform: 'win32',
    version: '4.2.6'
  }
});
