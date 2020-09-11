# Yellow belt

Express Typescript boilerplate project comes with preconfigured mongoose testing environment, passport local and jwt strategies and morgan logging

## Usage

```batch
mkdir yourProject
cd yourProject
git clone https://github.com/BilalDja/yellow-belt .
yarn
```
or
```batch
npm install
```
After downloading the project dependencies, you have to add .env file that holds your environment variables. To do that through the terminal:
```batch
cp .env.example .env
```
Then edit your .env file according to your needs

Whenever you change the .env file either by adding or removing a variable please run:
```batch
yarn gen-env
```
or
```batch
npm run gen-env
```
That will update your .env.example and src/types/env.d.ts files.

## Database

This project comes with mongodb configuration out of the box using mongoose and mongodb-memory-server for testing.
You can find the configuration for both the database and fake server in `src/config/db.ts` file.

## Basic Authentication

This project uses [passport.js][passport] to authenticate users.
It has two entities `user`, `token` used alongside with [passport-local][passport-local] and [passport-jwt][passport-jwt]
to implement local authentication *(email, password)* for signup and login the user, and jsonwebtoken *JWT* strategy to protect endpoints.
> PS: You have to make sure you add `SECRET` (very secret one) variable in your .env file or as a system environment variable.

## Testing

This project runs tests using **mocha** test framework, and **chai** assertion library

## Logging

This project uses morgan library to create logs. You can find the configuration under `src/config/morgan.ts`. It writes logs to the console and stores them in files.
The project uses rotating-file-stream
___
## Contribution

***Any suggestions are welcome, or you can add a PR (Pull request)***

[mongoose]:https://mongoosejs.com/
[passport]:http://www.passportjs.org/
[passport-local]:http://www.passportjs.org/packages/passport-local/
[passport-jwt]:http://www.passportjs.org/packages/passport-jwt/
[rotating-file-stream]:
