const list = (items) => `
<ul>
  ${items.map(i => `<li>${i}</li>`).join('')}
</ul>
`;

const network = (network) => `
<div class="network entity-information-section">
  <h4>Network</h4>
  <table>
    ${network.hostname ? `<tr><th>Hostname</th><td>${network.hostname}</td></tr>` : ''}
    ${network.ip ? `<tr><th>IP</th><td>${network.ip}</td></tr>` : ''}
    ${network.section ? `<tr><th>Section</th><td>${network.section}</td></tr>` : ''}
    ${network.dns && network.dns.length ? `<tr><th>DNS</th><td>${list(network.dns)}</td></tr>` : ''}
    ${network.traffic && network.traffic.length ? `<tr><th>Traffic</th><td>${list(network.traffic)}</td></tr>` : ''}
    ${network.ports && network.ports.length ? `<tr><th>Ports</th><td>${list(network.ports)}</td></tr>` : ''}
  </table>
</div>
`;

const hardware = (hardware) => `
<div class="hardware entity-information-section">
  <h4>Hardware</h4>
  <table>
    ${hardware.cpu ? `<tr><th>CPU</th><td>${hardware.cpu}</td></tr>` : ''}
    ${hardware.memory ? `<tr><th>Memory</th><td>${hardware.memory}</td></tr>` : ''}
    ${hardware.disk ? `<tr><th>Disk</th><td>${hardware.disk}</td></tr>` : ''}
  </table>
</div>
`;

const software = (software) => `
<div class="software entity-information-section">
  <h4>Software</h4>
  <table>
    ${software.os ? `<tr><th>OS</th><td>${software.os}</td></tr>` : ''}
    ${software.backup ? `<tr><th>Backup</th><td>${software.backup}</td></tr>` : ''}
    ${software.services ? `<tr><th>Services</th><td>${list(software.services)}</td></tr>` : ''}
  </table>
</div>
`;

const description = (description) => `
<div class="description entity-information-section">
  <h4>Description</h4>
  <p>${description}</p>
</div>
`;

const host = (host) => `
<div class="entity">
  <h3>${host.title}</h3>
  <div class="entity-information">
    ${host.os ? `<p><strong>OS</strong> ${host.os}</p>` : '' }  
    ${host.backup ? `<p><strong>Backup</strong> ${host.backup}</p>` : '' }
    
    ${host.network ? network(host.network) : ''}
    ${host.hardware ? hardware(host.hardware) : ''}
    ${host.software ? software(host.software) : ''}

    ${host.services && host.services.length ? list('Services', host.services) : ''}

    ${host.description ? description(host.description) : ''}
  </div>
</div>
`;

module.exports = (section) => `
<div class="section">
  <h3>${section.name}</h3>
  <div class="hosts">
    ${section.hosts ? section.hosts.map(h => host(h)).join('') : ''}
  </div>
</div>
`;