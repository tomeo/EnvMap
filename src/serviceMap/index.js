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

module.exports = (services) => `
  <h3>Services</h3>
  <div class="internal-services">
    ${services
      .filter(s => s.internal)
      .filter(s => s.dependencies)
      .map(s => service(s)).join('')}
  </div>
  <div class="internal-services-no-depedencies">
    ${services
      .filter(s => s.internal)
      .filter(s => !s.dependencies)
      .map(s => service(s)).join('')}
  </div>
  <div class="external-services">
    ${services.filter(s => !s.internal).map(s => service(s)).join('')}
  </div>
`;