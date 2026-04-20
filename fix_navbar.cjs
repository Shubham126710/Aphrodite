const fs = require('fs');

let nav = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');

// Replace the two buttons with smooth scrolling versions
const oldButtons = `<div className="flex space-x-6 md:space-x-12 items-center">
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Discover</button>
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Features</button>
        </div>`;

const newButtons = `  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  return (
    <nav className={\`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans uppercase tracking-[0.2em] text-[0.5rem] md:text-xs \${
      scrolled 
        ? 'bg-off-white/90 backdrop-blur-md shadow-sm py-4 border-b border-deep-rose/10' 
        : 'bg-transparent py-6 border-b-[1.5px] border-deep-rose/20'
    }\`}>
      <div className="max-w-[87.5rem] mx-auto px-4 md:px-8 flex justify-between items-center relative">
        <div className="flex space-x-3 md:space-x-12 items-center">
          <button onClick={(e) => scrollToSection('discover', e)} className="hover:text-primary-pink transition-colors uppercase tracking-[0.2em]">Discover</button>
          <button onClick={(e) => scrollToSection('features', e)} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Features</button>
        </div>`;

// First, we need to extract from `return (` on. Let's do it with RegEx so we don't break anything else, or just replace carefully.
nav = nav.replace(
`  return (
    <nav className={\`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans uppercase tracking-[0.2em] text-[0.625rem] md:text-xs \${
      scrolled 
        ? 'bg-off-white/90 backdrop-blur-md shadow-sm py-4 border-b border-deep-rose/10' 
        : 'bg-transparent py-6 border-b-[1.5px] border-deep-rose/20'
    }\`}>
      <div className="max-w-[87.5rem] mx-auto px-4 md:px-8 flex justify-between items-center relative">
        <div className="flex space-x-6 md:space-x-12 items-center">
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Discover</button>
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Features</button>
        </div>`,
newButtons);

fs.writeFileSync('src/components/Navbar.tsx', nav);
