const fs = require('fs');

// 1. Scale down Marquee
let marquee = fs.readFileSync('src/components/Marquee.tsx', 'utf-8');
marquee = marquee.replace('py-4 md:py-6', 'py-2 md:py-3');
marquee = marquee.replace('h-10 md:h-12', 'h-6 md:h-8');
marquee = marquee.replace('gap-8 md:gap-16', 'gap-4 md:gap-8');
marquee = marquee.replace('text-[10px] md:text-sm', 'text-[8px] md:text-[10px]');
marquee = marquee.replace('w-4 h-4', 'w-3 h-3');
marquee = marquee.replace('w-6 h-6', 'w-4 h-4');
marquee = marquee.replace('h-6 md:h-8', 'h-4 md:h-5');
fs.writeFileSync('src/components/Marquee.tsx', marquee);

// 2. Scale down Navbar
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace('py-6', 'py-4');
nav = nav.replace('py-4', 'py-2');
nav = nav.replace('text-[10px] md:text-xs', 'text-[9px] md:text-[10px]');
nav = nav.replace('text-2xl md:text-3xl', 'text-xl md:text-2xl');
nav = nav.replace('px-6 py-2.5', 'px-4 py-2');
fs.writeFileSync('src/components/Navbar.tsx', nav);

// 3. Scale down Hero (Discover Perfect Flames)
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
hero = hero.replace('text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]', 'text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl');
hero = hero.replace('text-xs sm:text-sm md:text-base', 'text-[10px] sm:text-xs md:text-sm');
hero = hero.replace('px-8 py-4 md:px-10 md:py-5', 'px-6 py-3 md:px-8 md:py-4');
hero = hero.replace('gap-12 lg:gap-16', 'gap-8 lg:gap-12');
hero = hero.replace('w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px]', 'w-[160px] sm:w-[180px] md:w-[220px] lg:w-[240px]');
hero = hero.replace('h-8 md:h-12 lg:h-16', 'h-6 md:h-8 lg:h-12');
fs.writeFileSync('src/components/Hero.tsx', hero);
