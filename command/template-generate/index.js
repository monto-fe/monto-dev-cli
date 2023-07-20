const yargs = require('yargs');
const inquirer = require('inquirer');
const Rx = require('rxjs');
const autocomplete = require('inquirer-autocomplete-prompt');

const generate = require('./generate');
const config = require('../../lib/config');
const logger = require('../../lib/logger');

inquirer.registerPrompt('autocomplete', autocomplete);

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

  const searchOptions = (options) => (answers, input) => {
    input = input || '';
    return new Promise((resolve) => {
      const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(input.toLowerCase()),
      );
      resolve(filteredOptions);
    });
  };

  const prompts = new Rx.Subject();

  async function handleSelect(result) {
    if (result.name === 'type') {
      argv.type = result.answer;
      prompts.next({
        name: 'component',
        type: 'autocomplete',
        message: 'Please select the component: ',
        source: searchOptions(components[argv.type]),
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
    type: 'autocomplete',
    message: 'Please select the framework you want: ',
    source: searchOptions(types),
  });
};
