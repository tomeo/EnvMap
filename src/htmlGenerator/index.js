var host = require('../serverMap');
var services = require('../serviceMap');
var drawGraph = require('../drawGraph');
var serverGraph = require('../serverGraph');
var serviceGraph = require('../serviceGraph');
var clusterGraph = require('../clusterGraph');

const environment = (environment) => {
  [nodes, edges] = serverGraph(environment);
  return `
<div class="environment">
  <div class="hosts">
    <h3>Hosts</h3>
    ${environment.hosts.map(h => host(h)).join('')}
  </div>

  ${serverGraph(environment, 'serverGraph')}

  <div class="services">
    ${services(environment)}
  </div>

  ${serviceGraph(environment, 'serviceGraph')}

  ${clusterGraph(environment, 'clusterGraph')}
</div>
`};

module.exports = (json, visJs, visCss, css) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${json.name}</title>
  <script type="text/javascript">${visJs}</script>
  <style type="text/css">${css}</style>
  <style type="text/css">${visCss}</style>
</head>
<body>
  <div>${environment(json)}</div>
</body>
</html>
`};