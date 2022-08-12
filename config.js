const c = require('ansi-colors');

const generate = require('./command/generate');

const logger = require('./lib/logger');

const callback = async argv => {
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
}

const buildRequestMessage = argv => {
  const result = [];
  if (argv.component && argv.component.length) {
    argv.component.forEach(com => result.push({ '名称': com, '类型': '组件', '组件类型': argv.type }))
  }

  return result;
}

const commandConfigs = [
  {
    command: ['generate', 'g'],
    showInHelp: true,
    description: '使用方式: react-dev-cli g -c test1 test2 -t class',
    descriptionEN: 'start generate React element',
    options: {
      component: {
        alias: 'c',
        type: 'array',
        default: ['react-dev-cli-component'],
        describe: '输入想要生成的组件名称',
        describeEN: 'Component name you want to generate'
      },
      type: {
        alias: 't',
        type: 'string',
        default: 'function',
        choices: ['function', 'class'],
        describe: '输入想要生成的组件类型',
        describeEN: 'Component type you want to generate'
      },
    },
    callback: callback
  },
];

module.exports = commandConfigs;
