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
    description: '启动一个本地服务，模拟返回接口数据',
    options: {
      type: {
        type: 'string',
        default: 'action',
        describe: '选择API类型',
        choices: ['action', 'restful'],
      },
      port: {
        type: 'number',
        default: 9000,
        describe: '选择启动的端口号',
      },
      timeout: {
        alias: 't',
        type: 'number',
        default: 0,
        describe: '默认延时返回请求 0ms',
      },
      autoCreate: {
        alias: 'c',
        type: 'boolean',
        default: false,
        describe: '如果mock目录不存在是否自动创建，默认不自动创建',
      },
      customPath: {
        type: 'string',
        default: '',
        describe: '自定义配置json数据存放路径',
      },
      headers: {
        type: 'array',
        default: [],
        describe: 'please enter custom key-value',
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
