var drawGraph = require('../drawGraph');

module.exports = (environment, id) => {
  var nodes = new Map();
  var nodeIndex = 1;
  for(var i = 0; i < environment.hosts.length; i++) {
    environment.hosts.map(h => nodes.set(
      h.title,
      {
        id: nodeIndex++,
        label: h.title,
        group: environment.hosts[i].name,
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

  return drawGraph(
    Array.from(nodes.values()),
    Array.from(edges.values()),
    id
  );
};