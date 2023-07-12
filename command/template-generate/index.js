const generate = require('./generate');
const logger = require('../../lib/logger');

const buildRequestMessage = (argv) => {
  const result = [];
  if (argv.component && argv.component.length) {
    argv.component.forEach((com) =>
      result.push({ 名称: com, 类型: '组件', 组件类型: argv.type }),
    );
  }

  return result;
};

module.exports = function templateGenerate(argv) {
  console.log(' ');
  console.log('================== start ==================');
  console.log(' ');
  logger.success('Start to run React dev generate:');
  console.table(buildRequestMessage(argv));

  generate(argv);

  setTimeout(() => {
    console.log(' ');
    console.log('生成完毕! done !');
    console.log(' ');
    console.log('================== end ===================');
    console.log(' ');
  });
};
