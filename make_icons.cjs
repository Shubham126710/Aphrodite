const sharp = require('sharp');
sharp('public/favicon.svg').resize(180, 180).png().toFile('public/apple-touch-icon.png')
  .then(() => console.log('180 done'));
sharp('public/favicon.svg').resize(192, 192).png().toFile('public/icon-192.png')
  .then(() => console.log('192 done'));
sharp('public/favicon.svg').resize(512, 512).png().toFile('public/icon-512.png')
  .then(() => console.log('512 done'));
