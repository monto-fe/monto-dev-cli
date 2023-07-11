const Mock = require('mockjs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const env = require('./env');

function generateApi() {}

function checkAPIPath() {}

module.exports = function handleRestful(app, autoCreate) {
  const filePath = path.resolve(process.cwd(), `${env.path}/`);
  console.log('restful filePath', filePath);
  if (!fs.existsSync(filePath)) {
    if (autoCreate) {
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
        fs.writeFileSync('./mock/api/get.json', data);
      });
      console.log(
        chalk.green(
          `curl --location --request GET 'http://localhost:9000/api'`,
        ),
      );
    } else {
      console.log(
        'The current directory mock folder does not exist, you can create it use : ' +
          chalk.red('u-admin-cli mock -n'),
      );
    }
  }

  app.all('*', async (req, res) => {
    const key = req.params[0];
    const method = req.method;
    const file = `${filePath}${key}/${method}.json`;
    console.log('file', file);
    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        res.send(NotFoundResponse);
      } else {
        // console.log("data", JSON.parse(data))
        // TODO:可以固定参数增加筛选，或者写一写过滤函数，引入mock等，重新生成返回数据，更多的模拟返回值
        // res.send(data);
        res.send(Mock.mock(JSON.parse(data)));
      }
    });
  });
};
