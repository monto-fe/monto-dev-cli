#!/usr/bin/env node

/* eslint-disable */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import config from './command/config';

// const logger = require('./lib/logger');

// yargs.scriptName('monto-dev-cli');

// yargs.usage(`
// 用法：$0 <cmd> [args]
// `);

config.forEach((commandConfig) => {
  const { command, description, options, callback } = commandConfig;

  yargs(hideBin(process.argv))
    .command(
      command,
      description,
      (yargs) => yargs.options(options),
      (argv = {}) => {
        if (!argv) process.exit(0);
        callback({ ...argv });
      },
    )
    .demandCommand(1)
    .parse();
});

// yargs.demandCommand().help().strict().argv;
