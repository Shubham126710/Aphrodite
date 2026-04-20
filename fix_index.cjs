const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf-8');

index = index.replace(
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
  '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n    <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />\n    <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="default" />'
);

fs.writeFileSync('index.html', index);
