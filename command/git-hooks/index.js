const gitHooks = require('./gitHooks');
const logger = require('../../lib/logger');

module.exports = function gitHooksCallback(argv) {
  // 配置 githooks，需在项目根目录下使用
  console.log(' ');
  console.log('================== start ==================');
  console.log(' ');
  logger.success('Start to config: ' + argv.prettier);

  gitHooks(argv);

  setTimeout(() => {
    console.log(' ');
    console.log('配置完毕! done !');
    console.log(' ');
    console.log('================== end ===================');
    console.log(' ');
  });
};
