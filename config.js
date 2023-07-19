const callback = require('./command/git-hooks');
const templateGenerate = require('./command/template-generate');
const mock = require('./command/mock');

const commandConfigs = [
  {
    command: ['generate [type] [component]', 'g'],
    showInHelp: true,
    description: '生成模板组件',
    descriptionEN: 'generate component',
    options: {
      type: {
        alias: 't',
        type: 'string',
        // demandOption: true,
        describe: '输入想要生成的前端框架类型',
        describeEN: 'Frame type you want to generate',
      },
      component: {
        alias: 'c',
        type: 'string',
        // demandOption: true,
        describe: '输入想要生成的组件名称',
        describeEN: 'Component name you want to generate',
      },
    },
    callback: async (argv) => {
      templateGenerate(argv);
    },
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
    callback: callback,
  },
  {
    command: 'mock',
    description: 'Start a local server to mock returning API data.',
    options: {
      type: {
        type: 'string',
        default: '',
        describe: 'Choosing an API style',
        choices: ['', 'restful', 'action'],
      },
      port: {
        type: 'number',
        default: 9000,
        describe: 'Choosing a port number for startup',
      },
      timeout: {
        alias: 't',
        type: 'number',
        default: 0,
        describe: 'Setting API delay for response.',
      },
      customPath: {
        type: 'string',
        default: '',
        describe:
          'Mock data storage path, absolute path, default to the current CLI execution path.',
      },
      headers: {
        type: 'array',
        default: [],
        describe: 'Please enter the custom request headers for CORS.',
      },
      withoutOpenBrowser: {
        alias: 'withoutOpen',
        type: 'boolean',
        default: false,
        describe: 'Open the browser',
      },
    },
    callback: async (argv) => {
      mock({
        ...argv,
      });
    },
  },
];

module.exports = commandConfigs;
