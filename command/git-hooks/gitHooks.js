const path = require('path');
const fs = require('fs');
const execa = require('execa');
const ora = require('ora');
const childProcess = require('child_process');

const logger = require('../../lib/logger');
const dataPackage = require('../../package.json');

module.exports = async (argv) => {
  // 1. 处理参数
  if (argv.prettier) {
    await configPrettier();
  }

  return null;
};

const configPrettier = async () => {
  const spinner = ora('Loading...').start();
  // 2. 读取 package.json
  if (!dataPackage) {
    logger.warnL('项目根目录下 package.json 文件不存在!');
  }

  if (dataPackage.gitHooks) {
    logger.warnL('package.json 已经配置了 gitHooks!');
  } else {
    Object.assign(dataPackage, {
      gitHooks: {
        'pre-commit': 'lint-staged',
      },
    });
  }

  if (!dataPackage.scripts) {
    dataPackage.scripts = {};
  }

  dataPackage.scripts = {
    ...dataPackage.scripts,
    prettier: 'prettier --write "**/*.{js,jsx,tsx,ts,less,md,json}"',
  };

  if (!dataPackage['lint-staged']) {
    Object.assign(dataPackage, {
      'lint-staged': {
        '*.{js,jsx,less,md,json}': ['prettier --write'],
        '*.ts?(x)': ['prettier --parser=typescript --write'],
      },
    });
  } else {
    logger.warnL('package.json 已经配置了 lint-staged!');
  }

  logger.stepL({ step: '[1/2]', content: '写入 package.json...' });
  spinner.text = logger.step({
    step: '[1/2]',
    content: '写入 package.json...',
  });

  fs.writeFileSync(`package.json`, JSON.stringify(dataPackage, null, '\t'));

  logger.stepL({ step: '[2/2]', content: '安装依赖中...' });
  spinner.text = logger.step({ step: '[2/2]', content: '安装依赖中...' });

  const res = childProcess.execSync(
    'yarn add -D lint-staged prettier yorkie',
    (error, stdout, stderr) => {
      console.log('config callback', error, stdout, stderr);
    },
  );

  spinner.stop();
};
