const inquirer = require('inquirer');
const generate = require('./generate');
// const logger = require('../../lib/logger');

module.exports = async function templateGenerate(argv) {
  // 判断参数：
  if (!argv.type) {
    // 没有选 type，默认从头开始选
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'type',
          message: '请选择想要生成的前端框架类型',
          choices: ['react', 'vue'],
          default: 'react',
        },
      ])
      .then((answers) => {
        // 使用用户选择的值
        argv.type = answers.type;

        inquirer
          .prompt([
            {
              type: 'list',
              name: 'component',
              message: '请选择想要生成的组件名称',
              choices: ['mui-less-v5/list/prod'],
            },
          ])
          .then((answers) => {
            // 使用用户选择的值
            argv.component = answers.component;

            generate(argv);
          });
      });
    return;
  }

  if (!argv.component) {
    // 选了 type，没有选 component
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'component',
          message: '请选择想要生成的组件名称',
          choices: ['mui-less-v5/list/prod'],
        },
      ])
      .then((answers) => {
        // 使用用户选择的值
        argv.component = answers.component;

        generate(argv);
      });
  }
};
