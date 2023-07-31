import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import {
  checkAPIPath,
  getAllAPIPath,
  jsonParserPlus,
  jsonParser,
} from './utils/index.js';
import config from '../../lib/config.js';
import logger from '../../lib/logger.js';
import env from './env.js';

const require = createRequire(import.meta.url);
const { createProxyMiddleware } = require('http-proxy-middleware');
const Mock = require('mockjs');

function generateApi(app, filePath, apiList) {
  app.all(apiList, jsonParser, async (req, res) => {
    const method = req.method.toLowerCase();
    const apiName = req.url.substr(1).split('/').join('-');
    const file = `${filePath}/${method}/${apiName}.json`;
    // TODO: 出现两次
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

export default function handleRestful(app, mockPath) {
  const filePath =
    mockPath || path.resolve(process.cwd(), env.mockPath.restful);
  // Mock data does not exist, automatically creating it.
  if (!fs.existsSync(filePath)) {
    checkAPIPath(filePath);
  }
  const apiList = getAllAPIPath(filePath);
  // start proxy
  generateApi(app, filePath, apiList);

  // proxy old url
  const {
    mock: { proxyApiUrl },
  } = config();
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
