const fs = require('fs');
const ora = require('ora');
const yargs = require('yargs');

const logger = require('../../lib/logger');
const { execProcess } = require('../../util');
const dataPackage = require('../../package.json');

module.exports = async (argv) => {
  // 1. 处理参数
  if (argv.prettier) {
    await configPrettier();
  } else {
    logger.output.error('Config params error!');
    yargs.showHelp();
    process.exit(1);
  }
};

const configPrettier = async () => {
  const warnTip = [];

  const spinner = ora();
  spinner.text = logger.message.step({
    step: '[1/2]',
    content: 'Writing package.json...',
  });
  spinner.start();
  // 2. 读取 package.json
  if (!dataPackage) {
    spinner.fail();
    logger.output.error('package.json file not found! ');
    process.exit(1);
  }

  if (dataPackage.gitHooks) {
    warnTip.push('package.json already configured with gitHooks!');
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
    warnTip.push('package.json already configured with lint-staged!');
  }

  try {
    fs.writeFileSync(`package.json`, JSON.stringify(dataPackage, null, 2));
  } catch {
    spinner.fail();
    logger.output.error(
      'Config failed! Failed to write to package.json file. Please check file permissions.',
    );
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  warnTip.forEach((warn) => logger.output.warn(warn));

  spinner.text = logger.message.step({
    step: '[2/2]',
    content: 'Installing dependencies...',
  });
  spinner.start();

  await execProcess('yarnd add -D lint-staged prettier yorkie').catch((e) => {
    if (e) {
      spinner.fail();
      logger.output.error(e);
      process.exit(1);
    }
  });

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
};
