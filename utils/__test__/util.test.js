import { getDirname } from '../util';

describe('get dirname', () => {
  test('return the correct dirname', () => {
    const importMateUrl = 'file:///path/to/your/module.file.js';
    const dirname = getDirname(importMateUrl);
    expect(dirname).toBe('/path/to/your');
  });
});
