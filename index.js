#!/usr/bin/env node

/* eslint-disable node/shebang */
const yargs = require('yargs');

const config = require('./config');

const logger = require('./lib/logger');

yargs.usage(`
$0 <cmd> [args]
`);

config.forEach(commandConfig => {
  const { command, description, options, callback } = commandConfig;

  yargs.command(
    command,
    description,
    yargs => yargs.options(options),
    (argv = {}) => {
      if (!argv) process.exit(0)
      callback({ ...argv });
    }
  );
});

yargs.demandCommand().strict().argv;
