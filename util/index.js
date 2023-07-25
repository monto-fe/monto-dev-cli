const childProcess = require('child_process');

const execProcess = (command) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }

      resolve();
    });
  });
};

module.exports = {
  execProcess,
};
