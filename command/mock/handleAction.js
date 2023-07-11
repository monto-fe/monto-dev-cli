const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const Mock = require('mockjs');
const env = require('./env');
const logger = require('../../lib/logger');

function createActionMockData() {
  fs.mkdir(`mock`, function (err) {
    if (err) {
      return console.error(err.message);
    }
    fs.mkdirSync(`./mock/api`);

    let student = {
      Action: 'post',
      RetCode: 200,
      Message: '',
      Data: [
        {
          Id: 1,
          Name: 'san.li',
        },
      ],
    };
    let data = JSON.stringify(student, '', '\t');
    fs.writeFileSync('./mock/api/list.json', data);
  });
}

module.exports = function handleAction(app, autoCreate, customPath) {
  const filePath = path.resolve(
    process.cwd(),
    customPath ? customPath : `${env.path}/action`,
  );
  console.log(filePath);
  // 如果目录不存在，提示是否自动创建，
  // 1、是自动创建，提示路径
  if (!fs.existsSync(filePath) && !autoCreate) {
    // 1、不自动创建且没有目录，提示阅读文档自行创建
    logger.errorL('please create mock data first, example: url');
    console.log(
      'The current directory mock folder does not exist, you can create it use : ' +
        chalk.red('u-admin-cli mock -n'),
    );
    return;
  } else if (!fs.existsSync(filePath) && autoCreate) {
    // 1、mock数据不存在，自动创建
    createActionMockData();
  } else if (fs.existsSync(filePath)) {
    // 2、如果目录存在，直接读取
  }

  console.log(
    chalk.green(
      `curl --location --request POST 'http://localhost:9000/api' \ --header 'Content-Type: application/json' \ --data-raw '{ "Action": "list" }'`,
    ),
  );

  // 如果在mock下，判断下key的值
  app.post('*', async (req, res) => {
    console.log('type', req.params, filePath);
    const key = req.params[0].substring(1);

    console.log('key', key);
    const { Action } = req.body;

    if (key) {
      const fileList = [];
      try {
        fs.readdirSync(filePath).forEach((fileName) => {
          fileList.push(fileName);
        });
      } catch (err) {
        res.send(env.notFoundResponse);
        return;
      }

      if (!fileList.includes(key) || !Action) {
        res.send(env.notFoundResponse);
        return;
      }
    }

    const file = `${filePath}${key}/${Action}.json`; //文件路径，__dirname为当前运行js文件的目录
    console.log('file', file);

    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(env.notFoundResponse);
      } else {
        // setTimeout(()=> {
        res.send(Mock.mock(JSON.parse(data)));
        // }, 2000)
      }
    });
  });
};
