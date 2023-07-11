const path = require('path');
const fs = require('fs');
const Mock = require('mockjs');
const ora = require('ora');
const env = require('./env');
const logger = require('../../lib/logger');
const checkAction = require('./utils/checkAction');
const { readJson } = require('./utils');

function createActionMockData(filePath) {
  const spinner = ora('Generating mock data...').start();
  try {
    fs.mkdirSync(`${filePath}`, { recursive: true });
    const data = readJson(path.join(__dirname, 'utils', 'actionRes.json'));
    Object.keys(data).forEach((key) => {
      let dataJson = JSON.stringify(data[key], '', '\t');
      fs.writeFileSync(`${filePath}/${key}.json`, dataJson);
    });
    spinner.succeed('Generate mock data is success');
  } catch (err) {
    logger.errorL(err.message);
    spinner.fail(`There is an error: ${err.message}`);
  }
}

function generateApi(app, filePath) {
  app.post('*', async (req, res) => {
    const { Action } = req.body;

    const hasAction = checkAction(Action, filePath);

    if (!hasAction) {
      res.send(env.notFoundResponse);
    } else {
      const file = `${filePath}/${Action}.json`;
      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          res.send(env.notFoundResponse);
        } else {
          res.send(Mock.mock(JSON.parse(data)));
        }
      });
    }
  });
}

module.exports = function handleAction(app, autoCreate, customPath) {
  const filePath = path.resolve(
    process.cwd(),
    customPath ? customPath : `${env.path}/action`,
  );

  if (!fs.existsSync(filePath) && !autoCreate) {
    // 不自动创建且没有目录，提示阅读文档自行创建
    logger.errorL('please create mock data first, example: url');
  } else if (!fs.existsSync(filePath) && autoCreate) {
    // mock数据不存在，自动创建
    createActionMockData(filePath);
  } else {
    // start proxy
    generateApi(app, filePath);
  }
};
