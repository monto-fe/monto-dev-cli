const path = require('path');
const fs = require('fs');
const Mock = require('mockjs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = require('./env');
const { checkAction, createActionMockData } = require('./utils');
const config = require('../../lib/config');

function generateApi(app, filePath) {
  const { proxyApiUrl } = config();
  app.post('*', async (req, res) => {
    const { Action } = req.body;
    const hasAction = checkAction(Action, filePath);
    if (!hasAction) {
      if (proxyApiUrl) {
        const mainProjectProxy = createProxyMiddleware({
          target: proxyApiUrl,
          changeOrigin: true,
        });
        app.use('*', mainProjectProxy);
      } else {
        res.send(env.notFoundResponse);
      }
    } else {
      const file = `${filePath}/${Action}.json`;
      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          if (proxyApiUrl) {
            const mainProjectProxy = createProxyMiddleware({
              target: proxyApiUrl,
              changeOrigin: true,
            });
            app.use('*', mainProjectProxy);
          } else {
            res.send(env.notFoundResponse);
          }
        } else {
          res.send(Mock.mock(JSON.parse(data)));
        }
      });
    }
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
  // proxy mock api
  generateApi(app, filePath);
};
