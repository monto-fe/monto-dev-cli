// const yargs = require('yargs');
import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';

import generate from './generate';
import config from '../../utils/config';
import logger from '../../utils/logger';

inquirer.registerPrompt('autocomplete', autocomplete);

export default async function templateGenerate(argv) {
  const { template } = config();
  const { types, components, generateDirectory, remoteRegistry } = {
    ...template,
  };

  // 指令参数可用
  if (argv.type && argv.component) {
    await generate({
      generateDirectory,
      remoteRegistry,
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
    // yargs.showHelp();
    process.exit(0);
  }

  const searchOptions = (options) => (answers, input) => {
    input = input || '';
    return new Promise((resolve) => {
      const filteredOptions = (options || []).filter((option) =>
        option.toLowerCase().includes(input.toLowerCase()),
      );
      resolve(filteredOptions);
    });
  };

  const getComponentOptions = () => {
    return types.map((type) => {
      return {
        name: 'component',
        type: 'autocomplete',
        message: 'Please select the component: ',
        source: searchOptions(components[type]),
        when: (answers) => answers.type === type,
      };
    });
  };

  const questions = [
    {
      name: 'type',
      type: 'autocomplete',
      message: 'Please select the framework: ',
      source: searchOptions(types),
    },
    ...getComponentOptions(),
  ];

  await inquirer.prompt(questions).then(async (answers) => {
    await generate({
      generateDirectory,
      remoteRegistry,
      ...answers,
    });
  });
}
