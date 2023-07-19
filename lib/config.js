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

const getConfig = () => {
  const defaultConfigPath = path.join(process.cwd(), defaultConfigName);
  const configPath = path.join(process.cwd(), configName);

  let mock = {};
  let template = {};
  let config = {};
  let defaultConfig = {};
  // 用户配置
  if (fs.existsSync(configPath)) {
    config = require(configPath);
  }

  // 默认配置
  if (fs.existsSync(defaultConfigPath)) {
    defaultConfig = require(defaultConfigPath);
  }

  // 配置获取优先级：monto.config.js > lib/const
  mock = Object.assign({}, defaultConfig.mock, libMock, config.mock);
  template = Object.assign(
    {},
    defaultConfig.template,
    libTemplate,
    config.template,
  );

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
