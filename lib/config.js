// 处理配置的请求参数，根据功能筛选需要的参数
const path = require('path');
const { configName } = require('./const');

const defaultMockConfig = {
  mock: {
    proxyApiUrl: '',
  },
};

const getMockConfig = () => {
  const configPath = path.join(process.cwd(), configName);
  const { mock } = require(configPath);
  return {
    ...defaultMockConfig.mock,
    ...mock,
  };
};

module.exports = getMockConfig;
