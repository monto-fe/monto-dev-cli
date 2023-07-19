const fs = require('fs');
const path = require('path');
const ora = require('ora');
const getPort = require('get-port');
const bodyParser = require('body-parser');
const env = require('../env');
const logger = require('../../../lib/logger');

function readJson(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const obj = JSON.parse(data);
  return obj;
}

async function getIdlePort(defaultPort) {
  return await getPort({
    port: getPort.makeRange(defaultPort, defaultPort + 1),
  });
}

function getAllAction(filePath) {
  const fileList = [];
  try {
    fs.readdirSync(filePath).forEach((fileName) => {
      const name = fileName.substring(0, fileName.lastIndexOf('.'));
      fileList.push(name);
    });
  } catch (err) {
    logger.output.error(err.message);
    return fileList;
  }
  return fileList;
}

function checkAction(action, filePath) {
  if (!action) {
    return false;
  }
  const fileList = getAllAction(filePath);
  if (fileList.includes(action)) {
    return true;
  }
  return false;
}

function createActionMockData(filePath) {
  const spinner = ora('Generating mock data...').start();
  try {
    fs.mkdirSync(`${filePath}`, { recursive: true });
    const data = readJson(path.join(__dirname, 'actionRes.json'));
    Object.keys(data).forEach((key) => {
      let dataJson = JSON.stringify(data[key], '', '\t');
      fs.writeFileSync(`${filePath}/${key}.json`, dataJson);
    });
    spinner.succeed('Generate mock data is success');
  } catch (err) {
    logger.output.error(err.message);
    spinner.fail(`There is an error: ${err.message}`);
  }
}

function checkAPIPath(filePath) {
  const spinner = ora('Generating mock data...').start();
  try {
    const data = readJson(path.join(__dirname, 'restfulRes.json'));
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
    logger.output.error(err.message);
    spinner.fail(`There is an error: ${err.message}`);
  }
}

function getAllAPIPath(filePath) {
  try {
    const apiPath = [];
    const apiTypeDir = fs.readdirSync(filePath);
    apiTypeDir.forEach((file) => {
      const list = fs.readdirSync(`${filePath}/${file}`);
      apiPath.push(...list);
    });
    return apiPath.map((api) => {
      const name = `-${api.substring(0, api.lastIndexOf('.'))}`.replace(
        /-/g,
        '/',
      );
      return name;
    });
  } catch (err) {
    logger.error('restful mock file is wrong');
    return [];
  }
}

const jsonParserPlus = bodyParser.json({
  type: 'application/*+json',
  limit: env.requestLimit,
});
const jsonParser = bodyParser.json({
  type: 'application/json',
  limit: env.requestLimit,
});

module.exports = {
  readJson,
  checkAction,
  createActionMockData,
  checkAPIPath,
  getIdlePort,
  getAllAction,
  getAllAPIPath,
  jsonParserPlus,
  jsonParser,
};
