const fs = require('fs');
const logger = require('../../../lib/logger');

module.exports = function checkAction(action, filePath) {
  if (!action) {
    return false;
  }
  const fileList = [];
  try {
    fs.readdirSync(filePath).forEach((fileName) => {
      const name = fileName.split('.')[0];
      fileList.push(name);
    });
  } catch (err) {
    logger.errorL(err.message);
    return false;
  }
  if (fileList.includes(action)) {
    return true;
  }
  return false;
};
