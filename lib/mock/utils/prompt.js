import inquirer from 'inquirer';
import logger from '../../../utils/logger';

export async function HandleSelectApiStyle() {
  let { styleType } = await inquirer.prompt([
    {
      name: 'styleType',
      type: 'list',
      message: `Please select either the RESTful or Action-style API?`,
      choices: [
        { name: 'Restful', value: 'restful' },
        { name: 'Action', value: 'action' },
      ],
    },
  ]);
  return styleType;
}

export async function ConfirmPort(port, newPort) {
  return await inquirer
    .prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: logger.output.warn(
          `Port ${port} is occupied, and we will enable port ${newPort}.?`,
        ),
        deafult: true,
      },
    ])
    .then((answers) => {
      if (answers.confirm) {
        return true;
      } else {
        return false;
      }
    })
    .catch(() => {
      return true;
    });
}
