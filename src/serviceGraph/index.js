var drawGraph = require('../drawGraph');

module.exports = (environment, id) => {
  var i = 1;
  var nodes = new Map(environment.services.map(s => ({
    id: i++,
    label: s.title,
    color: s.internal ? 'skyblue' : 'black',
    font: {
      color: s.internal ? 'black' : 'white'
    },
    group: s.cluster,
    margin: 10,
    shape: 'box'
  })).map((i) => [i.label, i]));

  var edges = [];
  for(var i = 0; i < environment.services.length; i++) {
    if (environment.services[i].dependencies) {
      for(var j = 0; j < environment.services[i].dependencies.length; j++) {
        var serviceName = environment.services[i].title;
        var service = nodes.get(serviceName);
        var depedencyName = environment.services[i].dependencies[j];
        var depedency = nodes.get(depedencyName);
        edges.push({
          from: service.id,
          to: depedency.id
        });
      }
    }
  }

  return drawGraph(
    Array.from(nodes.values()),
    edges,
    id
  );
}