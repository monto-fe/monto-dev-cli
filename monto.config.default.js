const { mock } = require('./lib/const');

module.exports = {
  template: {
    generateDirectory: `${process.cwd()}/generate-component`,
    remoteRegistry: 'git@gitee.com:monto_1/cli-template.git',
    types: ['react', 'vue'],
    components: {
      react: ['mui-less-v5/list/prod'],
      vue: ['antd-css-v5/list'],
    },
  },
  mock: {
    proxyApiUrl: mock.proxyApiUrl,
  },
};
