const Mock = require('mockjs');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const logger = require('../../lib/logger');
const env = require('./env');
const { readJson } = require('./utils');

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

function checkAPIPath(filePath) {
  const spinner = ora('Generating mock data...').start();
  try {
    const data = readJson(path.join(__dirname, 'utils', 'restfulRes.json'));
    Object.keys(data).forEach((key) => {
      fs.mkdirSync(`${filePath}/${key}`, { recursive: true });
      Object.keys(data[key]).forEach((api) => {
        const apiName = api.split('/').join('-');
        let dataJson = JSON.stringify(data[key][api], '', '\t');
        fs.writeFileSync(`${filePath}/${key}/${apiName}.json`, dataJson);
      });
    });
    spinner.succeed('Generate mock data is success');
  } catch (err) {
    logger.errorL(err.message);
    spinner.fail(`There is an error: ${err.message}`);
  }
}

module.exports = function handleRestful(app, autoCreate, customPath) {
  const filePath = path.resolve(
    process.cwd(),
    customPath ? customPath : `${env.path}/restful`,
  );

  if (!fs.existsSync(filePath) && !autoCreate) {
    // 不自动创建且没有目录，提示阅读文档自行创建
    logger.errorL('please create mock data first, example: url');
  } else if (!fs.existsSync(filePath) && autoCreate) {
    // mock数据不存在，自动创建
    checkAPIPath(filePath);
  } else {
    // start proxy
    generateApi(app, filePath);
  }
};
