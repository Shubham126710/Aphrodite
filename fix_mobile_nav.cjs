const fs = require('fs');

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// 1. Hide 'Discover' on mobile so it doesn't overlap and solve the "does nothing on mobile" issue by moving it to desktop only.
nav = nav.replace(
  '<button onClick={() => setCurrentPage(\'home\')} className="hover:text-primary-pink transition-colors uppercase tracking-[0.2em]">Discover</button>',
  '<button onClick={() => setCurrentPage(\'home\')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Discover</button>'
);

// 2. Reduce 'Aphrodite' font size slightly on mobile to prevent any chance of overlap with 'Join Club'.
nav = nav.replace(
  "scrolled ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'",
  "scrolled ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'"
);

// 3. Make 'Join Club' button smaller on mobile.
nav = nav.replace(
  "scrolled ? 'px-4 py-1.5 text-[9px]' : 'px-5 py-2'",
  "scrolled ? 'px-3 py-1 text-[0.5rem] md:px-4 md:py-1.5 md:text-[0.5625rem]' : 'px-3 py-1.5 text-[0.5625rem] md:px-5 md:py-2 md:text-xs'"
);

fs.writeFileSync('src/components/Navbar.tsx', nav);
