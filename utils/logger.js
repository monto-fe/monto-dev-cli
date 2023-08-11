import chalk from 'chalk';

const colorMapper = {
  dim: (msg) => chalk.dim(msg),
  log: (msg) => msg + '',
  tip: (msg) => chalk.blue.italic(msg),
  success: (msg) => chalk.green(msg),
  warn: (msg) => chalk.yellowBright(msg),
  error: (msg) => chalk.red.bold(msg),
  step: (msg) => chalk.magentaBright(msg.step) + ' ' + msg.content,
};

const output = {};
const message = {};

for (const key in colorMapper) {
  const mapper = colorMapper[key];
  output[key] = (msg) => console.log(mapper(msg));
}

for (const key in colorMapper) {
  const mapper = colorMapper[key];
  message[key] = (msg) => mapper(msg);
}

export default {
  output,
  message,
};
