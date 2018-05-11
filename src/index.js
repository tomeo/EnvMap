const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const parseFile = (confPath) => readFileAsync(confPath, 'utf8').then(data => JSON.parse(data));

const list = (items) => `
<ul>
  ${items.map(i => `<li>${i}</li>`).join('')}
</ul>
`;

const network = (network) => `
<div class="network host-information-section">
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
<div class="hardware host-information-section">
  <h4>Hardware</h4>
  <table>
    ${hardware.cpu ? `<tr><th>CPU</th><td>${hardware.cpu}</td></tr>` : ''}
    ${hardware.memory ? `<tr><th>Memory</th><td>${hardware.memory}</td></tr>` : ''}
    ${hardware.disk ? `<tr><th>Disk</th><td>${hardware.disk}</td></tr>` : ''}
  </table>
</div>
`;

const software = (software) => `
<div class="software host-information-section">
  <h4>Software</h4>
  <table>
    ${software.os ? `<tr><th>OS</th><td>${software.os}</td></tr>` : ''}
    ${software.backup ? `<tr><th>Backup</th><td>${software.backup}</td></tr>` : ''}
    ${software.services ? `<tr><th>Services</th><td>${list(software.services)}</td></tr>` : ''}
  </table>
</div>
`;

const description = (description) => `
<div class="description host-information-section">
  <h4>Description</h4>
  <p>${description}</p>
</div>
`;

const host = (host) => `
<div class="host">
  <h3>${host.title}</h3>
  <div class="host-information">
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

const section = (section) => `
<div class="section">
  <h3>${section.name}</h3>
  <div class="hosts">
    ${section.hosts ? section.hosts.map(h => host(h)).join('') : ''}
  </div>
</div>
`;

const environment = (environment) => `
<div class="environment">
  <h2>${environment.name} <a href="${environment.url}" target="_blank">${environment.url}</a></h2>
  <div class="sections">
    ${environment.sections ? environment.sections.map(s => section(s)).join('') : ''}
  </div>
</div>
`;

const template = (data, css) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.project}</title>
  <style type="text/css">
    ${css}
  </style>
</head>
<body>
  <h1>${data.project} <a href="${data.url}" target="_blank">${data.url}</a></h1>
  <div>${data.environments.map(e => environment(e)).join('')}</div>
</body>
</html>
`;

module.exports = (confPath, outPath) => {
  return Promise.all([readFileAsync('./style.css', 'utf8'), parseFile(confPath)])
    .then(([css, json]) => writeFileAsync(outPath, template(json, css)));
};