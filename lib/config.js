// 处理配置的请求参数，根据功能筛选需要的参数
const path = require('path');
const fs = require('fs');
const { configName } = require('./const');

const defaultMockConfig = {
  mock: {
    proxyApiUrl: '',
  },
};

const defautTempleteConfig = {
  remoteRegistry: 'git@gitee.com:monto_1/cli-tepmlate.git',
  generateDir: 'generate-components',
  types: ['react', 'vue'],
  components: ['mui-less-v5/list/prod'],
};

const getConfig = () => {
  const configPath = path.join(process.cwd(), configName);

  let mock = {};
  let templete = {};
  if (fs.existsSync(configPath)) {
    const config = require(configPath);
    mock = config.mock;
    templete = config.templete;
  }

  return {
    Mock: {
      ...defaultMockConfig.mock,
      ...mock,
    },
    Templete: {
      ...defautTempleteConfig,
      ...templete,
    },
  };
};

module.exports = getConfig;
