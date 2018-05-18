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
      readFileAsync('../node_modules/vis/dist/vis.js', 'utf8'),
      readFileAsync('../node_modules/vis/dist/vis-network.min.css', 'utf8'),
      parseFile(confPath)])
    .then(([
      styleCss,
      visJs,
      visCss,
      json]) => writeFileAsync(outPath, htmlGenerator(
        json,
        visJs,
        visCss,
        styleCss)));
};