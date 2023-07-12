#!/usr/bin/env node

/* eslint-disable */
const yargs = require('yargs');

const config = require('./config');

yargs.usage(`
$0 <cmd> [args]
`);

config.forEach((commandConfig) => {
  const { command, description, options, callback } = commandConfig;
  yargs.command(
    command,
    description,
    (yargs) => yargs.options(options),
    (argv = {}) => {
      if (!argv) process.exit(0);
      callback({ ...argv });
    },
  );
});

yargs.demandCommand().strict().argv;
