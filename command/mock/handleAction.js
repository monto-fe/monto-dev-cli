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

function generateApi(app, filePath, proxyKey) {
  app.use(proxyKey, jsonParser, async (req, res) => {
    const { Action } = req.body;
    const file = `${filePath}/${Action}.json`;
    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(env.notFoundResponse);
      } else {
        res.send(Mock.mock(JSON.parse(data)));
      }
    });
  });
}

module.exports = function handleAction(app, customPath) {
  const filePath = customPath
    ? customPath
    : path.resolve(process.cwd(), env.mockPath.action);

  // Mock data does not exist, automatically creating it.
  if (!fs.existsSync(filePath)) {
    createActionMockData(filePath);
  }

  // get all action name
  const allAction = getAllAction(filePath);
  const proxyKey = allAction.map((item) => `/${item}`);
  generateApi(app, filePath, proxyKey);

  const { proxyApiUrl } = config();
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
