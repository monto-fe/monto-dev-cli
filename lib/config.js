// Process the requested parameters for configuration
// and filter the necessary parameters based on the functionality.
const path = require('path');
const fs = require('fs');
const {
  configName,
  defaultConfigName,
  template: libTemplate,
  mock: libMock,
} = require('./const');
const logger = require('./logger');

const getDefaultConfig = () => {
  const defaultConfigPath = path.join(__dirname, '../', defaultConfigName);
  if (fs.existsSync(defaultConfigPath)) {
    return require(defaultConfigPath) || {};
  }

  return {};
};

const getUserConfig = () => {
  const configPath = path.resolve(configName);
  if (fs.existsSync(configPath)) {
    return require(configPath) || {};
  }

  return {};
};

const getMergedConfigParams = () => {
  const defaultConfig = getDefaultConfig();
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
    libTemplate,
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
    mock: {
      ...mock,
    },
    template: {
      ...template,
    },
  };
};

module.exports = getConfig;
