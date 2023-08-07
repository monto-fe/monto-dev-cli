import config from '../config';

describe('getUserConfig', () => {
  const baseConfig = config();
  console.log('result', baseConfig);
  const expectedTypes = ['react', 'vue'];

  const expectedComponents = {
    react: ['mui-less-v5/list/prod'],
    vue: ['antd-css-v5/list'],
  };

  it('should have the correct mock config', () => {
    expect(baseConfig).toEqual({
      mock: {
        proxyApiUrl: expect.any(String),
        headers: expect.any(String),
        type: expect.any(String),
      },
      template: {
        components: expect.objectContaining(expectedComponents),
        generateDirectory: expect.any(String),
        remoteRegistry: expect.any(String),
        types: expect.arrayContaining(expectedTypes),
      },
    });
  });
});
