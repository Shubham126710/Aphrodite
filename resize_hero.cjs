const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

// Replace padding of main section
content = content.replace('pb-20 md:pb-24 pt-24 md:pt-32', 'pb-16 md:pb-20 pt-20 md:pt-28 lg:pt-32');

// Replace card width
// original: w-[240px] sm:w-[280px] md:w-[340px]
content = content.replace('w-[240px] sm:w-[280px] md:w-[340px]', 'w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px]');

// Replace typography sizes
// original: text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[8rem]
content = content.replace('text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] xl:text-[8rem]', 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]');

// Let's also adjust the text "Perfect" svg position if needed - leave it as is for now

// We can also reduce the width max constraints to ensure it's not expanding too far on wide screens
content = content.replace('max-w-[1400px]', 'max-w-[1280px]');

fs.writeFileSync('src/components/Hero.tsx', content);
