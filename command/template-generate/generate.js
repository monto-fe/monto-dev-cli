const fs = require('fs');
const path = require('path');
const execa = require('execa');
const ora = require('ora');

const logger = require('../../lib/logger');

module.exports = async (argv) => {
  const result = {
    ...argv,
    dirName: 'generate-components',
    generateIndex: 0,
    rootPath: process.cwd(),
    getWholePath: function () {
      return `${this.rootPath}/${this.dirName}`.split(/[\\/]/).join(path.sep);
    },
    remoteRegistry: 'git@gitee.com:monto_1/cli-tepmlate.git',
    getTempleteRegistryUrl: function () {
      return ['-b', `${this.type}/${this.component}`, this.remoteRegistry];
    },
  };

  const spinner = ora(
    logger.step({ step: '[1/6]', content: '获取当前路径...' }),
  ).start();

  // 1. 操作文件夹生成
  spinner.text = logger.step({
    step: '[1/6]',
    content: '在当前路径下生成模板文件夹...',
  });
  createFolder(result.dirName, result, spinner);

  // 2. 处理参数
  spinner.text = logger.step({ step: '[2/6]', content: '处理指令参数...' });
  logger.tip(`模板路径：${result.getTempleteRegistryUrl()}`);

  // 3. 拉取远程模板
  spinner.text = logger.step({ step: '[3/6]', content: '拉取模板...' });
  await getRemoteTemplate(
    result.getTempleteRegistryUrl(),
    result.getWholePath(),
    spinner,
  );

  // // await run(rootPath, `${templatePathRoot}${templatePathDir}`, result, spinner);

  // // // 6. 收尾工作
  // // afterRun(templatePathRoot, spinner);

  spinner.text = logger.step({ step: '[5/6]', content: '模板文件处理中...' });
  spinner.text = logger.step({ step: '[6/6]', content: '模板文件清理中...' });

  logger.success('生成模板任务结束！');
  spinner.stop();
};

function createFolder(folderName, result, index = 0) {
  let newFolderName = folderName;

  if (index > 0) {
    newFolderName = `${folderName}_${index}`;
  }
  if (fs.existsSync(newFolderName)) {
    return createFolder(folderName, result, index + 1);
  }

  result.dirName = newFolderName;
  fs.mkdirSync(newFolderName);
  logger.log(`创建文件夹：${newFolderName}`);
}

const getRemoteTemplate = async (urls, path) => {
  try {
    const template = await execa(`git`, ['clone', ...urls], { cwd: path });
    return template;
  } catch (e) {
    logger.error(e);
    logger.warn('该模板文件未生成 !');
  }
};
