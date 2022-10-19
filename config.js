// const c = require('ansi-colors');

const logger = require('./lib/logger');

const callback = async (argv) => {
  const generate = require('./command/generate');

  console.log(' ');
  console.log('================== start ==================');
  console.log(' ');
  logger.successL('Start to run React dev generate:');
  console.table(buildRequestMessage(argv));

  await generate(argv);

  setTimeout(() => {
    console.log(' ');
    console.log('生成完毕! done !');
    console.log(' ');
    console.log('================== end ===================');
    console.log(' ');
  });
};

const configCallback = async (argv) => {
  const gitHooks = require('./command/gitHooks');

  // 配置 githooks，需在项目根目录下使用
  console.log(' ');
  console.log('================== start ==================');
  console.log(' ');
  logger.successL('Start to config: ' + argv.prettier);

  await gitHooks(argv);

  setTimeout(() => {
    console.log(' ');
    console.log('配置完毕! done !');
    console.log(' ');
    console.log('================== end ===================');
    console.log(' ');
  });
};

const buildRequestMessage = (argv) => {
  const result = [];
  if (argv.component && argv.component.length) {
    argv.component.forEach((com) =>
      result.push({ 名称: com, 类型: '组件', 组件类型: argv.type }),
    );
  }

  return result;
};

const commandConfigs = [
  {
    command: ['generate', 'g'],
    showInHelp: true,
    description: '使用方式: dux-react-dev-cli g -c test1 test2 -t class',
    descriptionEN: 'start to generate React element',
    options: {
      component: {
        alias: 'c',
        type: 'array',
        // default: ['react-dev-cli-component'],
        describe: '输入想要生成的组件名称',
        describeEN: 'Component name you want to generate',
      },
      styled: {
        alias: 's',
        type: 'array',
        // default: ['react-styled-wrapper'],
        describe: '输入想要生成的样式组件名称',
        describeEN: 'Style Component name you want to generate',
      },
      type: {
        alias: 't',
        type: 'string',
        default: 'function',
        choices: ['function', 'class'],
        describe: '类式组件还是函数式组件？',
        describeEN: 'RFC or CFC?',
      },
      language: {
        alias: 'l',
        type: 'string',
        default: 'jsx',
        choices: ['jsx', 'tsx'],
        describe: 'js还是ts？',
        describeEN: 'js or ts?',
      },
    },
    callback: callback,
  },
  {
    command: ['config', 'c'],
    showInHelp: true,
    description: '使用方式: dux-react-dev-cli c -p',
    descriptionEN: 'start to use githooks to config',
    options: {
      prettier: {
        alias: 'p',
        type: 'string',
        default: 'prettier',
        describe: '配置 prettier',
        describeEN: 'Config prettier',
      },
    },
    callback: configCallback,
  },
];

module.exports = commandConfigs;
