const callback = require('./command/git-hooks');
const templateGenerate = require('./command/template-generate');
const mock = require('./command/mock');

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
    callback: templateGenerate,
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
