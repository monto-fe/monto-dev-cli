const express = require('express');
const responseTime = require('response-time');
const bodyParser = require('body-parser');
const chalk = require('chalk');

const handleAction = require('./handleAction');
const handleRestful = require('./handleRestful');
const logger = require('../../lib/logger');

// type API风格，默认Restful
// autoCreate: false 是否自动生成
// timeout: 0, 支持接口延时返回
// 支持自定义请求头
// CLI支持中英文
module.exports = function (args) {
  const { port, type, autoCreate, timeout, headers, customPath } = args;

  const app = express();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(responseTime());

  app.all('*', (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    ); //访问控制允许报头 X-Requested-With: xhr请求
    res.header(
      'Access-Control-Allow-Metheds',
      'PUT, POST, GET, DELETE, OPTIONS',
    ); //访问控制允许方法
    res.header('Content-Type', 'application/json;charset=utf-8');

    headers.forEach((header) => {
      const [key, value] = header.split(':');
      res.header(key.trim(), value.trim());
    });

    setTimeout(() => {
      next();
    }, timeout);
  });

  switch (type) {
    case 'action':
      handleAction(app, autoCreate, customPath);
      break;
    case 'restful':
      handleRestful(app, autoCreate, customPath);
      break;
    default:
      logger.warnL(
        'We only support APIs that follow the action and RESTful styles',
      );
  }

  const startServer = () =>
    app.listen(port, () => {
      console.log(`Mock api listening on port ${port}!`);
      switch (type) {
        case 'action':
          console.log(
            chalk.green(
              `example: curl --location --request POST 'http://localhost:${port}' \ --header 'Content-Type: application/json' \ --data-raw '{ "Action": "Query" }'`,
            ),
          );
          break;
        case 'restful':
          console.log(
            chalk.green(
              `example: curl --location --request GET 'http://localhost:${port}/v1/user' \ --header 'Content-Type: application/json'`,
            ),
          );
          break;
      }
    });

  startServer();
};
