import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import {
  createActionMockData,
  getAllAction,
  jsonParserPlus,
  jsonParser,
} from './utils';
import config from '../../lib/config';
import logger from '../../lib/logger';
import env from './env.js';
const require = createRequire(import.meta.url);
const { createProxyMiddleware } = require('http-proxy-middleware');
const Mock = require('mockjs');

function generateApi(app, filePath, proxyKey) {
  app.use(proxyKey, jsonParser, async (req, res) => {
    const { Action } = req.body;
    const file = `${filePath}/${Action}.json`;
    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(env.notFoundResponse);
      } else {
        let result = {};
        try {
          result = Mock.mock(JSON.parse(data));
        } catch (err) {
          logger.error('json file is error', err.message);
        }
        res.send(result);
      }
    });
  });
}

export default function handleAction(app, mockPath) {
  const filePath = mockPath || path.resolve(process.cwd(), env.mockPath.action);

  // Mock data does not exist, automatically creating it.
  if (!fs.existsSync(filePath)) {
    createActionMockData(filePath);
  }

  // get all action name
  const {
    mock: { proxyApiUrl },
  } = config();
  let proxyKey = '*';
  console.log('proxyApiUrl', proxyApiUrl);
  if (proxyApiUrl) {
    const allAction = getAllAction(filePath);
    proxyKey = allAction.map((item) => `/${item}`);
  }
  generateApi(app, filePath, proxyKey);

  if (proxyApiUrl) {
    app.use(
      '*',
      jsonParserPlus,
      createProxyMiddleware({
        target: proxyApiUrl,
        changeOrigin: true,
      }),
    );
  }
}
