const fs = require('fs');
const path = require('path');
let config = null;
try {
  let filePath = path.join(__dirname, process.env.CONFIG_FILE || './config.json');
  // console.log(filePath);
  let configFile = fs.readFileSync(filePath);
  config = JSON.parse(configFile);
} catch (err) {
  throw new Error('error parsing config file: ' + err);
}
module.exports = config;
