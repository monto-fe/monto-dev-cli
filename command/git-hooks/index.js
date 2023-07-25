const gitHooks = require('./gitHooks');
const logger = require('../../lib/logger');

module.exports = async function gitHooksCallback(argv) {
  // 配置 githooks，需在项目根目录下使用
  logger.output.log('Start to config');
  process.stdout.write('\n');

  await gitHooks(argv);

  process.stdout.write('\n');
  logger.output.success('Configuration complete! ');
};
