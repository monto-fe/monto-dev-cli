import express from 'express';
import open from 'open';
import handleAction from './handleAction';
import handleRestful from './handleRestful';
import logger from '../../utils/logger';
import { getIdlePort, setHeader } from './utils';
import config from '../../utils/config';
import { HandleSelectApiStyle, ConfirmPort } from './utils/prompt';
import env from './env';

export default async function (args) {
  const { mock } = config();

  const { type: customType, headers: customHeaders } = mock;
  let { type, port, timeout, headers, mockPath, withoutOpenBrowser } = args;

  type = type || customType || (await HandleSelectApiStyle());

  let newPort = await getIdlePort(port);
  if (port !== newPort) {
    port = (await ConfirmPort(port, newPort)) ? newPort : null;
  }
  if (!port) {
    logger.output.error(
      `The current port is occupied and the service cannot be started. Please close the current port and try again.`,
    );
    process.exit(0);
  }

  const app = express();

  app.use(express.urlencoded({ extended: true }));

  if (customHeaders) {
    headers = [customHeaders];
  }

  app.all('*', (_, res, next) => {
    Object.keys(env.cors).forEach((key) => {
      res.header(key, env.cors[key]);
    });
    headers.forEach((header) => {
      let [key, value] = header.split(':');
      let headerKey = key.trim();
      value = value.trim();
      let newValue = value;
      newValue = setHeader(env, headerKey, value);
      res.header(headerKey, newValue);
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
      handleAction(app, mockPath);
      break;
    case 'restful':
      handleRestful(app, mockPath);
      break;
    default:
      logger.output.warn(
        'We only support APIs that follow the action and RESTful styles',
      );
      process.exit(0);
  }

  const startServer = () =>
    app.listen(port, async () => {
      logger.output.warn(`Mock api listening on port ${port}!`);
      switch (type) {
        case 'action':
          // TODO: 维护起来
          logger.output.success(
            `example: curl --location --request POST 'http://localhost:${port}' --header 'Content-Type: application/json' --data-raw '{ "Action": "Query" }'`,
          );
          break;
        case 'restful':
          if (!withoutOpenBrowser) {
            await open(`http://localhost:${port}/v1/user`);
          } else {
            logger.output.success(
              `example: curl --location --request GET 'http://localhost:${port}/v1/user' --header 'Content-Type: application/json'`,
            );
          }
          break;
      }
    });

  startServer();
}
