var section = require('../serverMap');
var services = require('../serviceMap');

const serverGraph = (environment) => {
  var nodes = new Map();
  var nodeIndex = 1;
  for(var i = 0; i < environment.sections.length; i++) {
    environment.sections[i].hosts.map(h => nodes.set(
      h.title,
      {
        id: nodeIndex++,
        label: h.title,
        group: environment.sections[i].name,
        shape: 'box'
      }
    ));
  }
  
  var serviceHosts = new Map(
    environment.services
    .filter(s => s.hosts)
    .map(s => [s.title, s.hosts]));
  
  var edges = new Map();
  environment.services
    .filter(s => s.dependencies)
    .map(s => s.dependencies.map(d => {
      var fromHosts = serviceHosts.get(s.title);
      if (serviceHosts.get(d)) {
        fromHosts.map(fh => serviceHosts.get(d).map(th => {
          var from = nodes.get(fh);
          var to = nodes.get(th);
          edges.set(
            `${from.label}${to.label}`,
            {
              from: from.id,
              to: to.id
            }
          );
        }
        ));
      }
    }));

  return [Array.from(nodes.values()), Array.from(edges.values())];
};

const environment = (environment) => {
  [nodes, edges] = serverGraph(environment);
  return `
<div class="environment">
  <h2>${environment.name} <a href="${environment.url}" target="_blank">${environment.url}</a></h2>
  <div class="sections">
    ${environment.sections ? environment.sections.map(s => section(s)).join('') : ''}
  </div>
  <div class="graph-container" id="${environment.name}-server-map"></div>
  <script type="text/javascript">
    new vis.Network(
      document.getElementById('${environment.name}-server-map'),
      {
        nodes: new vis.DataSet(${JSON.stringify(nodes)}),
        edges: new vis.DataSet(${JSON.stringify(edges)})
      },
      {
        interaction: {
          zoomView: false
        }
      });
  </script>
  <div class="services">
    ${services(environment)}
  </div>
</div>
`};

const connections = (services) => 
  [].concat.apply([], services.map(s => s.dependencies.map(d => [s.title, d])));

module.exports = (json, visJs, visCss, css) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${json.project}</title>
  <script type="text/javascript">${visJs}</script>
  <style type="text/css">${css}</style>
  <style type="text/css">${visCss}</style>
</head>
<body>
  <h1>${json.project}</h1>
  <div>${json.environments.map(e => environment(e)).join('')}</div>
</body>
</html>
`};