import config from '../config';

describe('getUserConfig', () => {
  const baseConfig = config();
  const expectedTypes = ['react', 'vue'];

  const expectedComponents = {
    react: ['mui-less-v5/list/prod'],
    vue: ['antd-css-v5/list'],
  };

  it('should have the correct mock config', () => {
    const { mock, template } = baseConfig;
    expect(mock.proxyApiUrl).toBeDefined();
    expect(mock.headers).toBeDefined();
    expect(mock.type).toBeDefined();

    expect(template).toEqual(
      expect.objectContaining({
        components: expect.objectContaining(expectedComponents),
        generateDirectory: expect.any(String),
        remoteRegistry: expect.any(String),
        types: expect.arrayContaining(expectedTypes),
      }),
    );
  });
});
