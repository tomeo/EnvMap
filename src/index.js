const { promisify } = require('util');
const fs = require('fs');
const htmlGenerator = require('./htmlGenerator');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const parseFile = (confPath) => readFileAsync(confPath, 'utf8')
  .then(data => JSON.parse(data));

module.exports = (confPath, outPath) => {
  return Promise.all([
      readFileAsync('./style.css', 'utf8'),
      readFileAsync('jquery.js', 'utf8'),
      readFileAsync('jquery.connections.js', 'utf8'),
      parseFile(confPath)])
    .then(([
      css,
      jQuery,
      jQueryConnections,
      json]) => writeFileAsync(outPath, htmlGenerator(
        json,
        jQuery,
        jQueryConnections,
        css)));
};