// Process the requested parameters for configuration
// and filter the necessary parameters based on the functionality.
const path = require('path');
const fs = require('fs');
const { configName } = require('./const');

const defaultMockConfig = {
  proxyApiUrl: '',
};

const defaultTemplateConfig = {
  remoteRegistry: 'git@gitee.com:monto_1/cli-template.git',
  generateDir: 'generate-components',
  types: ['react', 'vue'],
  components: ['mui-less-v5/list/prod'],
};

const getConfig = () => {
  const configPath = path.join(process.cwd(), configName);

  let mock = {};
  let template = {};
  if (fs.existsSync(configPath)) {
    const config = require(configPath);
    mock = config.mock;
    template = config.template;
  }

  return {
    mock: {
      ...defaultMockConfig,
      ...mock,
    },
    template: {
      ...defaultTemplateConfig,
      ...template,
    },
  };
};

module.exports = getConfig;
