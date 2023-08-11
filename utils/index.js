import { exec } from 'child_process';

export const execProcess = (command) => {
  return new Promise((resolve, reject) => {
    return exec(command, (error, stdout, stderr) => {
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};
