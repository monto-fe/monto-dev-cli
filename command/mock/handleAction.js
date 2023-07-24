const path = require('path');
const fs = require('fs');
const Mock = require('mockjs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = require('./env');
const {
  createActionMockData,
  getAllAction,
  jsonParserPlus,
  jsonParser,
} = require('./utils');
const config = require('../../lib/config');
const logger = require('../../lib/logger');

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

module.exports = function handleAction(app, mockPath) {
  const filePath = mockPath
    ? mockPath
    : path.resolve(process.cwd(), env.mockPath.action);

  // Mock data does not exist, automatically creating it.
  if (!fs.existsSync(filePath)) {
    createActionMockData(filePath);
  }

  // get all action name
  const {
    mock: { proxyApiUrl },
  } = config();
  let proxyKey = '*';

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
};
