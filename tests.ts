import Mocha from 'mocha';
import tests from './tests/subtests';
import path from 'path';
import app from './src/index';
import {fakeServer} from './src/config/db';

const config = () => {
  // location where we put our tests
  const testDirectory = './tests';
  const mocha = new Mocha({
    ui: 'bdd',
    reporter: 'spec',
    // We set the timeout to MAX_VALUE because mongodb in memory server needs to download mongod binary for the first time
    timeout: Number.MAX_VALUE,
    bail: false
  });
  // iterate through test files and add them to mocha test server
  tests.forEach(test => {
    mocha.addFile(path.join(testDirectory, test));
  });
  // We get the fake mongodb database so we can connect it to mongoose
  fakeServer.getUri().then((mongodbURI: string) => {
    // Override the database URI with the fake mongodb URI
    process.env.DATABASE_URL = mongodbURI;
    // app() starts the server, and list to 'started' event so we can launch the tests
    app().on('started', () => {
      // run mocha tests
      mocha.run(failure => {
        process.on('exit', () => {
          process.exit(failure);
        });
      });
    })
  });
};

config();
