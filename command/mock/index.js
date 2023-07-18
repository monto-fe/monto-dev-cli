const express = require('express');
const responseTime = require('response-time');
const open = require('open');

const handleAction = require('./handleAction');
const handleRestful = require('./handleRestful');
const env = require('./env');
const logger = require('../../lib/logger');
const { getIdlePort } = require('./utils');
const { HandleSelectApiStyle, ConfirmPort } = require('./utils/prompt');

module.exports = async function (args) {
  const { timeout, headers, customPath, withoutOpenBrowser } = args;
  let { type, port } = args;

  if (!type) {
    type = await HandleSelectApiStyle();
  }

  let newPort = await getIdlePort(port);
  let confirmPortResult = true;
  if (port !== newPort) {
    confirmPortResult = await ConfirmPort(port, newPort);
    if (confirmPortResult) {
      port = newPort;
    }
    logger.error(
      `The current port is occupied and the service cannot be started. Please close the current port and try again.`,
    );
    process.exit(0);
  }

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(responseTime());

  app.all('*', (_, res, next) => {
    Object.keys(env.cors).forEach((key) => {
      res.header(key, env.cors[key]);
    });
    headers.forEach((header) => {
      const [key, value] = header.split(':');
      let newValue = value;
      switch (key.trim()) {
        case 'Access-Control-Allow-Headers':
          newValue = `${
            env.cors['Access-Control-Allow-Headers']
          }, ${value.trim()}`;
          break;
        case 'Access-Control-Allow-Methods':
          newValue = `${
            env.cors['Access-Control-Allow-Methods']
          }, ${value.trim()}`;
          break;
        case 'Content-Type':
          newValue = value.trim();
          break;
      }
      res.header(key.trim(), newValue);
    });

    setTimeout(() => {
      next();
    }, timeout);
  });

  app.get('/monto/docs', function (_, res) {
    res.send(
      `<div>this page will show setting and cli usage, open default page</div>`,
    );
  });

  switch (type) {
    case 'action':
      handleAction(app, customPath);
      break;
    case 'restful':
      handleRestful(app, customPath);
      break;
    default:
      logger.error(
        'We only support APIs that follow the action and RESTful styles',
      );
      process.exit(0);
  }

  const startServer = () =>
    app.listen(port, async () => {
      logger.warn(`Mock api listening on port ${port}!`);
      switch (type) {
        case 'action':
          logger.success(
            `example: curl --location --request POST 'http://localhost:${port}' --header 'Content-Type: application/json' --data-raw '{ "Action": "Query" }'`,
          );
          break;
        case 'restful':
          if (!withoutOpenBrowser) {
            await open(`http://localhost:${port}/v1/user`);
          } else {
            logger.success(
              `example: curl --location --request GET 'http://localhost:${port}/v1/user' --header 'Content-Type: application/json'`,
            );
          }
          break;
      }
    });

  startServer();
};
