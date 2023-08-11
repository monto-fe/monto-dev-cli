import { execProcess } from '../';

describe('execProcess function', () => {
  test('executes a command and resolves with stdout', async () => {
    const command = 'echo "Hello, Jest!"';
    const stdout = (await execProcess(command)) || '';

    expect(stdout).toContain('Hello, Jest!');
  });

  test('rejects with stderr when command produces an error', async () => {
    const command = 'this-command-does-not-exist';

    try {
      await execProcess(command);
    } catch (error) {
      expect(error).toContain('this-command-does-not-exist');
    }
  });
});
