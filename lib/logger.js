const chalk = require('chalk');

const colorMapper = {
  log: (msg) => msg + '',
  tip: (msg) => chalk.blue.italic(msg),
  success: (msg) => chalk.green(msg),
  warn: (msg) => chalk.yellowBright(msg),
  error: (msg) => chalk.red.bold(msg),
  step: (msg) => chalk.magentaBright(msg.step) + ' ' + msg.content,
};

const logger = {};

for (const key in colorMapper) {
  if (colorMapper.key) {
    const mapper = colorMapper[key];
    logger[key] = (msg) => mapper(msg);
    logger[`${key}`] = (msg) => console.log(mapper(msg));
  }
}

module.exports = logger;
