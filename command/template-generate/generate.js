const fs = require('fs');
const execa = require('execa');
const ora = require('ora');

const logger = require('../../lib/logger');

module.exports = async (argv) => {
  const result = {};
  const spinner = ora(
    logger.step({ step: '[1/6]', content: '获取当前路径...' }),
  ).start();
  // 1. 获取当前执行指令的目录地址，生成的文件放在这里
  const rootPath = process.cwd();
  const templatePathRoot = `${rootPath}/generate-components`;

  // 2. 处理参数
  await processRequest(argv, result, spinner, spinner);

  // 3. 生成模板存放根路径
  await generateDir(rootPath, result, spinner);

  // 4. 拉取远程模板
  const template = await getRemoteTemplate(rootPath, spinner);

  // 5. 根据请求参数修改对应生成文件
  const name = argv.s ? 'style-wrapper' : 'component';
  const templatePathDir = `/dux-templates/components/${result.componentType}-${name}.${result.languageType}`;

  await run(rootPath, `${templatePathRoot}${templatePathDir}`, result, spinner);

  // 6. 收尾工作
  afterRun(templatePathRoot, spinner);
};

const processRequest = async (argv, result, spinner) => {
  setTimeout(() => logger.step({ step: '[1/6]', content: '获取当前路径...' }));
  spinner.text = logger.step({ step: '[2/6]', content: '处理指令参数...' });

  if (argv.component && argv.component.length) {
    // 组件类型
    result.componentType = argv.type;
    // 组件名称集合
    result.component = argv.component;
  }
  result.styled = argv.styled;
  // js还是ts
  result.languageType = argv.language;
};

const generateDir = async (rootPath, result, spinner) => {
  setTimeout(() => logger.step({ step: '[2/6]', content: '处理指令参数...' }));
  spinner.text = logger.step({ step: '[3/6]', content: '生成模板文件夹...' });

  if (result.component && result.component.length) {
    try {
      fs.mkdirSync(`${rootPath}/generate-components`);
    } catch {
      logger.warn(
        '当前用户没有文件操作权限或者 generate-components 目录已存在 !',
      );
    }
  }
};

const getRemoteTemplate = async (rootPath, spinner) => {
  setTimeout(() =>
    logger.step({ step: '[3/6]', content: '生成模板文件夹...' }),
  );
  spinner.text = logger.step({ step: '[4/6]', content: '拉取模板...' });

  try {
    const template = await execa(
      `git`,
      ['clone', 'https://gitee.com/dh1992/dux-templates.git'],
      { cwd: `${rootPath}/generate-components` },
    );
    return template;
  } catch (e) {
    logger.warn('该模板文件未生成 !');
  }
};

const run = async (rootPath, templatePath, result, spinner) => {
  setTimeout(() => logger.step({ step: '[4/6]', content: '拉取模板...' }));
  spinner.text = logger.step({ step: '[5/6]', content: '生成目标文件...' });

  try {
    fs.readFile(templatePath, (error, data) => {
      result.component.forEach((com) => {
        if (error) {
          logger.error('生成文件失败 ! 模板文件读取失败 !');
        }

        const comPath = `${rootPath}/${com}`;
        const file = processFileContent(data, com);

        if (fs.existsSync(comPath)) {
          fs.rmSync(comPath, { force: true, recursive: true });
        }

        generateFile(comPath, file, result.languageType || 'jsx');
      });
    });
  } catch {
    logger.error('生成文件失败 !');
  }
};

const processFileContent = (data, com) => {
  const dataString = data.toString();
  return dataString.replaceAll(
    'component',
    `${com[0].toUpperCase()}${com.slice(1, com.length - 1)}`,
  );
};

const generateFile = (comPath, file, type = 'js') => {
  fs.mkdirSync(comPath);

  // 生成js文件
  fs.writeFileSync(`${comPath}/index.${type}`, file);
};

const afterRun = (templatePathRoot, spinner) => {
  setTimeout(() => logger.stepL({ step: '[5/6]', content: '生成目标文件...' }));
  spinner.text = logger.step({ step: '[6/6]', content: '清理模板文件...' });

  fs.rmSync(templatePathRoot, { force: true, recursive: true });

  spinner.stop();
  setTimeout(() => logger.step({ step: '[6/6]', content: '清理模板文件...' }));
};

// const useLoading = async () => {
//   const { default: ora } = await import('ora');
//   const spinners = ora('loading...\r\n');

//   return { start: spinners.start.bind(this), stop: spinners.stop };
// };
