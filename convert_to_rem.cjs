const fs = require('fs');

// Update Hero.tsx
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

// Convert w-[240px] sm:w-[280px] md:w-[340px] to rems
// 240/16 = 15rem, 280/16 = 17.5rem, 340/16 = 21.25rem
hero = hero.replace('w-[240px] sm:w-[280px] md:w-[340px]', 'w-[15rem] sm:w-[17.5rem] md:w-[21.25rem]');

// Convert max-w-[1400px]  1400/16 = 87.5rem
hero = hero.replace('max-w-[1400px]', 'max-w-[87.5rem]');

// Convert text-[10px], text-[11px], text-[8px] in Hero
hero = hero.replaceAll('text-[8px]', 'text-[0.5rem]');
hero = hero.replaceAll('text-[10px]', 'text-[0.625rem]');
hero = hero.replaceAll('text-[11px]', 'text-[0.6875rem]');

fs.writeFileSync('src/components/Hero.tsx', hero);

// Update Navbar.tsx
let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
nav = nav.replace('max-w-[1400px]', 'max-w-[87.5rem]');
nav = nav.replaceAll('text-[10px]', 'text-[0.625rem]');
fs.writeFileSync('src/components/Navbar.tsx', nav);

// Update Marquee.tsx
let marquee = fs.readFileSync('src/components/Marquee.tsx', 'utf-8');
marquee = marquee.replaceAll('text-[10px]', 'text-[0.625rem]');
fs.writeFileSync('src/components/Marquee.tsx', marquee);

// Update index.css to add desktop font scaling
let css = fs.readFileSync('src/index.css', 'utf-8');
if (!css.includes('font-size: 80%;')) {
    css += `\n\n@media (min-width: 1024px) {
  html {
    font-size: 80%;
  }
}\n`;
    fs.writeFileSync('src/index.css', css);
}

