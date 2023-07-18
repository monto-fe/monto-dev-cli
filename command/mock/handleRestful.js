const Mock = require('mockjs');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const env = require('./env');
const {
  checkAPIPath,
  getAllAPIPath,
  jsonParserPlus,
  jsonParser,
} = require('./utils');
const config = require('../../lib/config');

function generateApi(app, filePath, apiList) {
  app.all(apiList, jsonParser, async (req, res) => {
    const method = req.method.toLowerCase();
    const apiName = req.url.substr(1).split('/').join('-');
    const file = `${filePath}/${method}/${apiName}.json`;
    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(env.notFoundResponse);
      } else {
        res.send(Mock.mock(JSON.parse(data)));
      }
    });
  });
}

module.exports = function handleRestful(app, customPath) {
  const filePath = customPath
    ? customPath
    : path.resolve(process.cwd(), env.mockPath.restful);
  // Mock data does not exist, automatically creating it.
  if (!fs.existsSync(filePath)) {
    checkAPIPath(filePath);
  }
  const apiList = getAllAPIPath(filePath);
  // start proxy
  generateApi(app, filePath, apiList);

  // proxy old url
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
