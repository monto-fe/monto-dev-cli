import { setHeader, getIdlePort } from '../utils';
import env from '../env';

describe('setHeader function', () => {
  it('should add a header to "Access-Control-Allow-Headers" correctly', () => {
    const headerKey = 'Access-Control-Allow-Headers';
    const value = 'New-Header';

    const result = setHeader(env, headerKey, value);

    expect(result).toBe(
      'Origin, X-Requested-With, Content-Type, Accept, New-Header',
    );
  });

  it('should add a header to "Access-Control-Allow-Methods" correctly', () => {
    const headerKey = 'Access-Control-Allow-Methods';
    const value = 'DELETE';

    const result = setHeader(env, headerKey, value);

    expect(result).toBe('PUT, POST, GET, DELETE, OPTIONS, DELETE');
  });

  it('should update "Content-Type" header correctly', () => {
    const headerKey = 'Content-Type';
    const value = 'application/json';

    const result = setHeader(env, headerKey, value);

    expect(result).toBe('application/json');
  });

  it('should return the same value if headerKey is not recognized', () => {
    const headerKey = 'Unknown-Header';
    const value = 'Unknown-Value';

    const result = setHeader(env, headerKey, value);
    expect(result).toBe('Unknown-Value');
  });
});

describe('getIdlePort', () => {
  it('getPort', async () => {
    const port = await getIdlePort(3000);
    expect(port).toBe(3000);
    const port1 = await getIdlePort(3000);
    expect(port1).toBe(3001);
  });
});
