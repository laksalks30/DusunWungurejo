
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove Impact Report section
html = html.replace(/<section id="impact-report"[\s\S]*?<\/section>/, '');

fs.writeFileSync('index.html', html);

