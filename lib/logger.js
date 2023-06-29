const c = require('ansi-colors');

const colorMapper = {
  log: (msg) => msg + '',
  tip: (msg) => c.blue.italic(msg),
  success: (msg) => c.green(msg),
  warn: (msg) => c.yellowBright(msg),
  error: (msg) => c.red.bold(msg),
  step: (msg) => c.magentaBright(msg.step) + ' ' + msg.content,
};

const logger = {};

for (const key in colorMapper) {
  if (colorMapper.hasOwnProperty(key)) {
    const mapper = colorMapper[key];
    logger[key] = (msg) => mapper(msg);
    logger[`${key}L`] = (msg) => console.log(mapper(msg));
  }
}

module.exports = logger;
