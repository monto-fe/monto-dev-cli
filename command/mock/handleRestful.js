const Mock = require('mockjs');
const path = require('path');
const fs = require('fs');

const env = require('./env');
const { checkAPIPath } = require('./utils');

function generateApi(app, filePath) {
  app.all('*', async (req, res) => {
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
  // start proxy
  generateApi(app, filePath);
};
