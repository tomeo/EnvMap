const list = (items) => `
<ul>
  ${items.map(i => `<li>${i}</li>`).join('')}
</ul>
`;

const description = (description) => `
<div class="description entity-information-section">
  <h4>Description</h4>
  <p>${description}</p>
</div>
`;

const hosts = (hosts) => `
<div class="hosts entity-information-section">
  <h4>Hosts</h4>
  ${list(hosts)}
</div>
`;

const dependencies = (dependencies) => `
<div class="dependencies entity-information-section">
  <h4>Dependencies</h4>
  ${list(dependencies)}
</div>
`;

const service = (service) => `
<div class="service entity ${!service.internal ? 'external': ''}" id="${service.title}">
  <h3>${service.title} ${!service.internal ? '(external)' : ''}</h3>
  <div class="entity-information">
    ${service.hosts ? hosts(service.hosts) : ''}
    ${service.dependencies ? dependencies(service.dependencies) : ''}    
    ${service.description ? description(service.description) : ''}
  </div>
</div>
`;

const serviceGraph = (services) => {
  var i = 1;
  var nodes = new Map(services.map(s => ({
    id: i++,
    label: s.title,
    color: s.internal ? 'skyblue' : 'black',
    font: {
      color: s.internal ? 'black' : 'white'
    },
    shape: 'box'
  })).map((i) => [i.label, i]));

  var edges = [];
  for(var i = 0; i < services.length; i++) {
    if (services[i].dependencies) {
      for(var j = 0; j < services[i].dependencies.length; j++) {
        var serviceName = services[i].title;
        var service = nodes.get(serviceName);
        var depedencyName = services[i].dependencies[j];
        var depedency = nodes.get(depedencyName);
        edges.push({
          from: service.id,
          to: depedency.id,
          arrows: 'to'
        });
      }
    }
  }

  return [Array.from(nodes.values()), edges];
};

module.exports = (environment) => {
  [nodes, edges] = serviceGraph(environment.services);
  return `
  <h3>Services</h3>
  <div class="internal-services">
    ${environment.services
      .filter(s => s.internal)
      .filter(s => s.dependencies)
      .map(s => service(s)).join('')}
  </div>
  <div class="internal-services-no-depedencies">
    ${environment.services
      .filter(s => s.internal)
      .filter(s => !s.dependencies)
      .map(s => service(s)).join('')}
  </div>
  <div class="external-services">
    ${environment.services.filter(s => !s.internal).map(s => service(s)).join('')}
  </div>
  <div class="graph-container" id="${environment.name}-service-map">
  <script type="text/javascript">
    new vis.Network(
      document.getElementById('${environment.name}-service-map'),
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
  </div>
`};