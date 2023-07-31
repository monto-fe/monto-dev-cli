import gitHooks from './gitHooks';
import logger from '../../lib/logger';

export default async function gitHooksCallback(argv) {
  // 配置 githooks，需在项目根目录下使用
  logger.output.log('Start to config');
  process.stdout.write('\n');

  await gitHooks(argv);

  setTimeout(() => {
    console.log(' ');
    console.log('配置完毕! done !');
    console.log(' ');
    console.log('================== end ===================');
    console.log(' ');
  });
}
