const fs = require('fs');
const path = require('path');
const execa = require('execa');
const ora = require('ora');

const logger = require('../../lib/logger');

let spinner;

function checkNodeVersion() {
  process.stdout.write('\n');
  spinner.start();
  spinner.text = logger.message.step({
    step: '[1/4]',
    content: 'Pre-check processing...',
  });

  const requiredNodeVersion = 12;
  const nodeVersion = process.versions.node;

  // 将 nodeVersion 转换为数字
  const currentVersion = Number(nodeVersion.split('.')[0]);

  if (currentVersion < requiredNodeVersion) {
    spinner.fail();
    logger.output.error(
      `Error: Node.js version must be ${requiredNodeVersion} or higher.`,
    );
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');

  spinner.succeed();
  logger.output.tip(`Your Node version is : ${nodeVersion}`);
}

function processParams(
  type,
  component,
  normalizedDirectoryPath,
  remoteRegistry,
) {
  spinner.start();
  spinner.text = logger.message.step({
    step: '[2/4]',
    content: 'Collection params...',
  });

  const result = {
    templeteRegistryUrls: [
      '-b',
      `${type}/${component}`,
      remoteRegistry,
      normalizedDirectoryPath,
    ],
    wholePath: normalizedDirectoryPath,
  };

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  logger.output.tip('Parameters collected successfully.');

  return result;
}

function checkFolder(dirPath) {
  spinner.start();
  spinner.text = logger.message.step({
    step: '[3/4]',
    content: 'Check folder...',
  });

  if (fs.existsSync(dirPath)) {
    spinner.fail();
    logger.output.error(`Error: The folder "${dirPath}" already exists.`);
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  logger.output.tip(`Your template will be placed in the ${dirPath}`);
}

async function generateTemplete(urls) {
  spinner.start();
  spinner.text = logger.message.step({
    step: '[4/4]',
    content: 'Generate templete...',
  });

  try {
    await execa(`git`, ['clone', ...urls]);
  } catch (e) {
    spinner.fail();
    logger.output.error(
      'Template generation failed! Template does not exist or remote repository is unavailable.',
    );
    logger.output.log(`Your template is [${urls[2]}, ${urls[1]}]`);
    process.stdout.write('\n');
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  process.stdout.write('\n');
}

module.exports = async function generate(argv) {
  const { type, component, generateDirectory, remoteRegistry } = argv;
  spinner = ora();

  // 处理配置文件的放置目录
  const normalizedDirectoryPath = path.resolve(
    path.normalize(generateDirectory).replace(/\\/g, '/'),
  );

  logger.output.log('Generate start.');

  // 1. 检查环境
  checkNodeVersion();

  // 2. 处理参数
  const params = processParams(
    type,
    component,
    normalizedDirectoryPath,
    remoteRegistry,
  );

  // 3. 文件夹检查
  checkFolder(params.wholePath);

  // 4. 拉取模板
  await generateTemplete(params.templeteRegistryUrls);

  logger.output.success('Template generation task completed.');
};
