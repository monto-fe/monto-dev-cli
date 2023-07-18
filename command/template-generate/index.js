const inquirer = require('inquirer');
const generate = require('./generate');
const config = require('../../lib/config');

module.exports = async function templateGenerate(argv) {
  const { Templete } = config();

  // 判断参数：
  if (!argv.type) {
    // 没有选 type，默认从头开始选
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Please select the framework you want: ',
          choices: Templete.types,
          default:
            Templete.types && Templete.types.length ? Templete.types[0] : '',
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
              message: 'Please select the component: ',
              choices: Templete.components,
              default:
                Templete.components && Templete.components.length
                  ? Templete.components[0]
                  : '',
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
          message: 'Please select the component: ',
          choices: Templete.components || [],
          default:
            Templete.components && Templete.components.length
              ? Templete.components[0]
              : '',
        },
      ])
      .then((answers) => {
        // 使用用户选择的值
        argv.component = answers.component;

        generate(argv);
      });
  }
};
