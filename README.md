<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">You may check my portfolio in <a href="https://github.com/troindx" target="_blank">Github</a> as well as my webpage at <a href="https://www.hamrodev.com" target="_blank">Hamro Dev</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This exercise has been developed using [Nest](https://github.com/nestjs/nest). It fulfills the endpoint described in /docs/swagger.yaml. Needless to say, in order for this to work, **Please make sure that you have Nodejs installed**

## Installation

```bash
$ npm install
```

## Running the app

**Before you run the app.** Make sure that you prepare your .env file. You can find a preset .env file with all the necessary strings in .env.dist file . Rename it to .env and change the mongo DB connection string accordingly. Make sure that your mongoDB has a _Users_ collection created as well as a _UserLists_ collection created before initializing.


**This endpoint uses MONGODB to run** so remember to have a mongoDB server running for the app to work. You can use docker compose and run the following commands.
```bash
# modern versions of docker
$ docker compose up db

# older versions of docker
$ docker-compose up db
```
This will create a mongoDB container that the app can connect to. If you cannot run your own mongoDB database, try Cloud Atlas from Mongodb <a href="https://www.mongodb.com/cloud/atlas>here</a>.

Once this is done. You can run the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
You can run the following tests. Tests are found inside of the modules/<modulename>/test folder. e2e tests can be found in the /test file.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
