var section = require('../serverMap');
var services = require('../serviceMap');

const environment = (environment) => `
<div class="environment">
  <h2>${environment.name} <a href="${environment.url}" target="_blank">${environment.url}</a></h2>
  <div class="sections">
    ${environment.sections ? environment.sections.map(s => section(s)).join('') : ''}
  </div>
  <div class="services">
    ${services(environment.services)}
  </div>
</div>
`;

const connections = (services) => 
  [].concat.apply([], services.map(s => s.dependencies.map(d => [s.title, d])));

module.exports = (json, jQuery, jQueryConnections, css) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${json.project}</title>
  <script src="http://code.jquery.com/jquery-latest.min.js"></script>
  <script type="text/javascript">${jQuery}</script>
  <script type="text/javascript">${jQueryConnections}</script>
  <style type="text/css">${css}</style>
</head>
<body>
  <h1>${json.project}</h1>
  <div>${json.environments.map(e => environment(e)).join('')}</div>
<script>
  jQuery(document).ready(function() {
    ${json.environments
      .filter(e => e.services && e.services.length)
      .map(e => connections(e.services.filter(s => s.dependencies)).map(([c, s]) =>
      `jQuery('#${c}').connections({ to: '#${s}' });`
    ).join('\n\t'))};
  });
</script>
</body>
</html>
`;