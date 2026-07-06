
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove UMKM section
html = html.replace(/<section id="umkm"[\s\S]*?<\/section>/, '');
// Remove UMKM Modal
html = html.replace(/<div id="umkm-modal-overlay"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, '');

// Remove Proker section
html = html.replace(/<section id="proker"[\s\S]*?<\/section>/, '');

// Remove Logbook section
html = html.replace(/<section id="logbook"[\s\S]*?<\/section>/, '');

// Remove Tim section
html = html.replace(/<section id="tim"[\s\S]*?<\/section>/, '');

// Remove Impact Report section
html = html.replace(/<section id="impact-report"[\s\S]*?<\/section>/, '');

fs.writeFileSync('index.html', html);

