const { mock } = require('./lib/const');

module.exports = {
  template: {
    generateDirectory: `${process.cwd()}/generate-component`,
    remoteRegistry: 'git@gitee.com:monto_1/cli-template.git',
  },
  mock: {
    proxyApiUrl: mock.proxyApiUrl,
  },
};
