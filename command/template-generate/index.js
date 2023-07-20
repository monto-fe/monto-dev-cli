const yargs = require('yargs');
const inquirer = require('inquirer');
const Rx = require('rxjs');

const generate = require('./generate');
const config = require('../../lib/config');
const logger = require('../../lib/logger');

module.exports = async function templateGenerate(argv) {
  const { template } = config();
  const { types, components } = { ...template };

  // 指令参数可用
  if (argv.type && argv.component) {
    generate({
      ...template,
      ...argv,
    });
    return;
  }

  if (
    !template ||
    !Array.isArray(types) ||
    !components ||
    !(components instanceof Object && !Array.isArray(components)) ||
    !types.length ||
    !Object.keys(components).length
  ) {
    logger.output.warn('No template available, please check your config ~');

    process.stdout.write('\n');
    yargs.showHelp();
    process.exit(0);
  }

  const prompts = new Rx.Subject();

  async function handleSelect(result) {
    if (result.name === 'type') {
      argv.type = result.answer;
      prompts.next({
        name: 'component',
        type: 'list',
        message: 'Please select the component: ',
        choices: components[argv.type],
      });
    }

    if (result.name === 'component') {
      argv.component = result.answer;

      await generate({
        ...template,
        ...argv,
      });

      prompts.complete();
    }
  }

  inquirer.prompt(prompts).ui.process.subscribe(
    async (result) => handleSelect(result),
    () => {
      logger.output.error(
        'Incorrect configuration for parameter types or components, please check! ',
      );
      process.exit(1);
    },
    () => {},
  );

  prompts.next({
    name: 'type',
    type: 'list',
    message: 'Please select the framework you want: ',
    choices: types,
  });
};
