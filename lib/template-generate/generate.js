import fs from 'fs';
import path from 'path';

import ora from 'ora';
import logger from '../../utils/logger';
import { execa } from 'execa';
// import { execProcess } from '../../utils/index.js';

let spinner;

function checkNodeVersion() {
  process.stdout.write('\n');
  spinner.text = logger.message.step({
    step: '[1/4]',
    content: 'Pre-check processing...',
  });
  spinner.start();

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
  spinner.text = logger.message.step({
    step: '[2/4]',
    content: 'Collection params...',
  });
  spinner.start();

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
  spinner.text = logger.message.step({
    step: '[3/4]',
    content: 'Check folder...',
  });
  spinner.start();

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
  spinner.text = logger.message.step({
    step: '[4/4]',
    content: 'Generate templete...',
  });
  spinner.start();

  try {
    // await execProcess(`mkdir ${path} && chmod 777 ${path} ./`)
    await execa(`git`, ['clone', ...urls]);
  } catch (e) {
    spinner.fail();
    logger.output.error(
      'Template generation failed! Maybe you have no folder permissions or the template is unavailable.',
    );
    logger.output.log(`Your template is [${urls[2]}, ${urls[1]}]`);
    process.stdout.write('\n');
    process.exit(1);
  }

  spinner.prefixText = logger.message.dim('[info]');
  spinner.succeed();
  process.stdout.write('\n');
}

export default async function generate(argv) {
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
}
