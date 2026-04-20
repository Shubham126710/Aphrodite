import { useState, useEffect } from 'react';

export interface NavbarProps {
  setCurrentPage: (page: 'home' | 'auth' | 'manifesto' | 'dashboard') => void;
}

export default function Navbar({ setCurrentPage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans uppercase tracking-[0.2em] text-[9px] md:text-[10px] ${
      scrolled 
        ? 'bg-off-white/90 backdrop-blur-md shadow-sm py-2 border-b border-deep-rose/10' 
        : 'bg-transparent py-4 border-b-[1.5px] border-deep-rose/20'
    }`}>
      <div className="max-w-[1024px] mx-auto px-4 md:px-8 flex justify-between items-center relative">
        <div className="flex space-x-6 md:space-x-12 items-center">
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary-pink transition-colors uppercase tracking-[0.2em]">Discover</button>
          <button onClick={() => setCurrentPage('home')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Features</button>
        </div>
        
        <div 
          onClick={() => setCurrentPage('home')}
          className={`absolute left-1/2 -translate-x-1/2 transition-transform duration-500 cursor-pointer font-serif text-deep-rose italic tracking-widest font-medium normal-case flex items-center justify-center ${
          scrolled ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'
        }`}>
          Aphrodite
        </div>
        
        <div className="flex space-x-6 md:space-x-8 items-center">
          <button onClick={() => setCurrentPage('manifesto')} className="hover:text-primary-pink transition-colors hidden md:inline uppercase tracking-[0.2em]">Manifesto</button>
          <button 
            onClick={() => setCurrentPage('auth')}
            className={`bg-primary-pink text-off-white rounded-full hover:bg-deep-rose transition-all shadow-md hover:shadow-lg uppercase tracking-[0.2em] ${
            scrolled ? 'px-4 py-1.5 text-[9px]' : 'px-5 py-2'
          }`}>
            Join Club
          </button>
        </div>
      </div>
    </nav>
  );
}