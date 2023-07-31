// Process the requested parameters for configuration
// and filter the necessary parameters based on the functionality.
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import Const from './const';
import logger from './logger';
import defaultConfig from './default.config.json';
const require = createRequire(import.meta.url);
// const defaultConfig = require('./default.config.json');
console.log('defaultConfig', defaultConfig);

const { configName, mock } = Const;
const { libMock } = mock;

const getUserConfig = () => {
  const configPath = path.resolve(process.cwd(), configName);
  if (fs.existsSync(configPath)) {
    return require(configPath) || {};
  }

  return {};
};

const getMergedConfigParams = () => {
  const userConfig = getUserConfig();

  if (!(userConfig instanceof Object)) {
    logger.output.wain('The configuration file should return a JSON object !');
    process.exit(1);
  }

  // 配置获取优先级：monto.config.js > lib/const
  const mock = Object.assign({}, defaultConfig.mock, libMock, userConfig.mock);
  const template = Object.assign(
    {},
    defaultConfig.template,
    userConfig.template,
  );

  return {
    mock,
    template,
  };
};

const getConfig = () => {
  const { mock, template } = getMergedConfigParams();

  return {
    mock,
    template,
  };
};

export default getConfig;
