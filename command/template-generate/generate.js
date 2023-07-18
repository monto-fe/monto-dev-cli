const fs = require('fs');
const path = require('path');
const execa = require('execa');
const ora = require('ora');

const config = require('../../lib/config');
const logger = require('../../lib/logger');

let spinner;

function checkNodeVersion() {
  process.stdout.write('\n');
  spinner.start();
  spinner.text = logger.message.step({
    step: '[1/4]',
    content: 'Pre-check processing...',
  });

  const requiredNodeVersion = 16;
  const nodeVersion = process.versions.node;

  // 将 nodeVersion 转换为数字
  const currentVersion = Number(nodeVersion.split('.')[0]);

  if (currentVersion < requiredNodeVersion) {
    spinner.stop();
    logger.output.error(
      `Error: Node.js version must be ${requiredNodeVersion} or higher.`,
    );
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');

  spinner.succeed();
  logger.output.tip(`Your Node version is : ${nodeVersion}`);
}

function processParams(argv, initialValues) {
  spinner.start();
  spinner.text = logger.message.step({
    step: '[2/4]',
    content: 'Collection params...',
  });

  const result = {
    ...argv,
    generateIndex: 0,
    rootPath: process.cwd(),
    ...initialValues,
    getWholePath: function () {
      return `${this.rootPath}/${this.generateDir}`
        .split(/[\\/]/)
        .join(path.sep);
    },
    getTempleteRegistryUrl: function () {
      return [
        '-b',
        `${this.type}/${this.component}`,
        this.remoteRegistry,
        this.generateDir,
      ];
    },
  };

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  logger.output.tip(
    `Your template will be placed in the ${result.getWholePath()}`,
  );
  return result;
}

function checkFolder(dirName) {
  spinner.start();
  spinner.text = logger.message.step({
    step: '[3/4]',
    content: 'Check folder...',
  });

  if (fs.existsSync(dirName)) {
    spinner.stop();
    logger.output.error(`Error: The folder "${dirName}" already exists.`);
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
}

async function generateTemplete(urls) {
  spinner.start();
  spinner.text = logger.message.step({
    step: '[4/4]',
    content: 'Generate templete...',
  });

  try {
    await execa(`git`, ['clone', ...urls], { cwd: './' });
  } catch (e) {
    spinner.stop();
    logger.output.error('Template generation failed !');
    logger.output.error(e);
  }

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  process.stdout.write('\n');
}

module.exports = async (argv) => {
  const { Templete } = config();

  spinner = ora();

  logger.output.log('Generate start.');
  // 1. 检查环境
  checkNodeVersion();

  // 2. 处理参数
  const result = processParams(argv, Templete);

  // 3. 文件夹检查
  checkFolder(result.generateDir);

  // 4. 拉取模板
  await generateTemplete(result.getTempleteRegistryUrl());

  logger.output.success('Template generation task completed.');
};
