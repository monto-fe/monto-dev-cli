module.exports = {
  defaultConfigName: 'monto.config.default.js',
  configName: 'monto.config.js',
  template: {
    types: ['react', 'vue'],
    components: {
      react: ['mui-less-v5/list/prod'],
      vue: ['antd-css-v5/list'],
    },
  },
  mock: {
    proxyApiUrl: '',
  },
};
