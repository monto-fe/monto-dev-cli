const fs = require('fs');

function readJson(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const obj = JSON.parse(data);
  return obj;
}

module.exports = {
  readJson,
};
