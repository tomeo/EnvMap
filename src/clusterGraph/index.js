var drawGraph = require('../drawGraph');
var _ = require('lodash');

module.exports = (environment, id) => {
  var services = environment.services;
  var clusters = _.uniq(services
    .filter(s => s.cluster)
    .map(s => s.cluster));

  var i = 1;
  var nodes = clusters.map(c => ({
    id: i++,
    shape: 'box',
    label: c,
    widthConstraint: { minimum: 150 },
    heightConstraint: { minimum: 50 }
  }));

  var edgeMap = new Map();
  for(let i = 0; i < services.length; i++) {
    if (services[i].cluster) {
      let from = nodes.find(n => n.label === services[i].cluster);
      if (from && services[i].dependencies) {
        for(let j = 0; j < services[i].dependencies.length; j++) {
          let toService = services.find(s => s.title === services[i].dependencies[j]);
          let to = nodes.find(n => n.label === toService.cluster);
          if (to && from.id !== to.id) {
            let key = `f${from.id}t${to.id}`;
            if (edgeMap.has(key)) {
              if (!edgeMap.get(key).label.split('\n').includes(toService.title)) {
                let e = edgeMap.get(key);
                e.label = `${e.label}\n${toService.title}`;
                edgeMap.set(key, e);
              }
            }
            else {
              edgeMap.set(
                key,
                {
                  from: from.id,
                  to: to.id,
                  label: toService.title
                });
            } 
          }
        }
      }
    }
  }

  return drawGraph(nodes, Array.from(edgeMap.values()), id);
};