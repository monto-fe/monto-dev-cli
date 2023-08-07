const chalk = require('chalk');

//           ____   __  __  ______  _____
//  /'\_/`\/\  __`\/\ \/\ \/\__  _\/\  __`\
// /\      \ \ \/\ \ \ `\\ \/_/\ \/\ \ \/\ \
// \ \ \__\ \ \ \ \ \ \ , ` \ \ \ \ \ \ \ \ \
//  \ \ \_/\ \ \ \_\ \ \ \`\ \ \ \ \ \ \ \_\ \
//   \ \_\\ \_\ \_____\ \_\ \_\ \ \_\ \ \_____\
//    \/_/ \/_/\/_____/\/_/\/_/  \/_/  \/_____/

const art = `
  ${chalk.bold.red('          ____   __  __  ______  _____')}
  ${chalk.bold.redBright(
    ` /'\\_/\`\\/\\  __\`\\/\\ \\/\\ \\/\\__  _\\/\\  __\`\\   `,
  )}
  ${chalk.bold.yellow(
    '/\\      \\ \\ \\/\\ \\ \\ `\\\\ \\/_/\\ \\/\\ \\ \\/\\ \\  ',
  )}
  ${chalk.bold.green(
    '\\ \\ \\__\\ \\ \\ \\ \\ \\ \\ , ` \\ \\ \\ \\ \\ \\ \\ \\ \\  ',
  )}
  ${chalk.bold.cyan(
    ' \\ \\ \\_/\\ \\ \\ \\_\\ \\ \\ \\`\\ \\ \\ \\ \\ \\ \\ \\_\\ \\ ',
  )}
  ${chalk.bold.blueBright(
    '  \\ \\_\\\\ \\_\\ \\_____\\ \\_\\ \\_\\ \\ \\_\\ \\ \\_____\\',
  )}
  ${chalk.bold.blue('   \\/_/ \\/_/\\/_____/\\/_/\\/_/  \\/_/  \\/_____/')}
`;

console.log(art);
console.log('Welcome to monto-dev-cli !');

process.stdout.write('\n');