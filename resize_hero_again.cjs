const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

// The user wants it to look like it did at 75-80% scale previously (when it was massive).
// This implies they actually want it SMALLER. We should reduce fonts further.

// Container scale mapping
// current: max-w-[1280px] -> max-w-[1024px]
content = content.replace('max-w-[1280px]', 'max-w-[1024px]');

// Card width mapping
// current w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px]
// to ~80% of current sizes: w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px]
content = content.replace('w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px]', 'w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px]');

// Typography scaling
// original: text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]
// to ~80% of original sizes:
// 5xl (3rem) -> 4xl (2.25rem)
// 6xl (3.75rem) -> 5xl (3rem)
// 7xl (4.5rem) -> 6xl (3.75rem)
// 8xl (6rem) -> 7xl (4.5rem)
// 7.5rem -> 6xl (3.75rem) / 7xl (4.5rem)
content = content.replace('text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]', 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]');

// Shrink logo a bit
// current: h-10 md:h-16 lg:h-24
content = content.replace('h-10 md:h-16 lg:h-24', 'h-8 md:h-12 lg:h-16');

fs.writeFileSync('src/components/Hero.tsx', content);

// Adjust the navbar width constraint as well
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace('max-w-[1280px]', 'max-w-[1024px]');
fs.writeFileSync('src/components/Navbar.tsx', nav);

