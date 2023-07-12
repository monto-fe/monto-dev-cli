const express = require('express');
const responseTime = require('response-time');
const bodyParser = require('body-parser');
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

  app.use(bodyParser.json({ limit: env.reqestLimit }));
  app.use(express.urlencoded({ extended: true }));
  app.use(responseTime());

  app.all('*', (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header(
      'Access-Control-Allow-Metheds',
      'PUT, POST, GET, DELETE, OPTIONS',
    );
    res.header('Content-Type', 'application/json;charset=utf-8');

    headers.forEach((header) => {
      const [key, value] = header.split(':');
      res.header(key.trim(), value.trim());
    });

    setTimeout(() => {
      next();
    }, timeout);
  });

  switch (type) {
    case 'action':
      handleAction(app, customPath);
      break;
    case 'restful':
      handleRestful(app, customPath);
      break;
    default:
      logger.warn(
        'We only support APIs that follow the action and RESTful styles',
      );
  }

  const startServer = () =>
    app.listen(port, async () => {
      logger.warn(`Mock api listening on port ${port}!`);
      switch (type) {
        case 'action':
          logger.success(
            `example: curl --location --request POST 'http://localhost:${port}' \ --header 'Content-Type: application/json' \ --data-raw '{ "Action": "Query" }'`,
          );
          break;
        case 'restful':
          if (!withoutOpenBrowser) {
            await open(`http://localhost:${port}/v1/user`);
          } else {
            logger.success(
              `example: curl --location --request GET 'http://localhost:${port}/v1/user' \ --header 'Content-Type: application/json'`,
            );
          }
          break;
      }
    });

  startServer();
};
