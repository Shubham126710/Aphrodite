import { useState, useEffect } from 'react';
import Marquee from './Marquee';

interface HeroProps {
  setCurrentPage: (page: 'home' | 'auth' | 'manifesto') => void;
}

export default function Hero({ setCurrentPage }: HeroProps) {
  const maxAvatars = 8;
  const [avatarIndex, setAvatarIndex] = useState(1);

  useEffect(() => {
    // Pick a random avatar on mount
    setAvatarIndex(Math.floor(Math.random() * maxAvatars) + 1);
  }, []);

  const handleRefreshAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * maxAvatars) + 1;
    } while (nextIndex === avatarIndex);
    setAvatarIndex(nextIndex);
  };

  return (
    <section className="min-h-[100svh] bg-soft-blush text-neutral-dark font-sans relative overflow-hidden flex flex-col p-4 md:p-8 shrink-0 pb-20 md:pb-24 pt-24 md:pt-32">
      <div className="noise-overlay"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 relative z-10 w-full max-w-[1400px] mx-auto mt-4 py-8 lg:py-0">
        
        {/* Central Illustration Area */}
        <div className="lg:w-1/2 flex justify-center order-2 lg:order-1 relative mt-16 md:mt-8 lg:mt-0 w-full z-20">
          
          {/* Rotating Stamp/Badge behind the art */}
          <div className="absolute -top-12 -left-4 md:-top-16 md:-left-8 w-32 h-32 md:w-40 md:h-40 rounded-full animate-spin-slow opacity-80 select-none z-0 mix-blend-multiply flex items-center justify-center">
             <svg viewBox="0 0 100 100" className="w-full h-full text-deep-rose">
                <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text className="text-[11px] font-sans font-bold tracking-[0.2em] fill-current uppercase">
                  <textPath href="#circlePath">EST. 2026 • MODERN ROMANCE ONLINE •</textPath>
                </text>
             </svg>
          </div>

          <div className="relative bg-off-white p-4 md:p-6 pb-12 md:pb-16 card-frame shadow-[8px_8px_0_0_rgba(158,58,68,0.15)] group rotate-[-2deg] hover:rotate-[-1deg] transition-all duration-500 ease-out flex-shrink-0 w-[280px] md:w-[340px]">
            <div className="w-full aspect-[4/5] bg-soft-blush overflow-hidden rounded-[4px] relative flex flex-col items-center justify-center border-[0.5px] border-deep-rose/30">
              <img 
                src={`/avatar${avatarIndex}.png`} 
                alt="Discover The One" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-10" 
              />
            </div>
            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center z-20">
              <span className="font-serif italic text-lg lg:text-xl text-deep-rose/80 font-medium">
                Find The One.
              </span>
              <button 
                onClick={handleRefreshAvatar}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-deep-rose/10 hover:bg-deep-rose/20 text-deep-rose transition-colors duration-300"
                aria-label="Refresh avatar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Typography Block */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20 order-1 lg:order-2">
          
          <div className="flex items-center gap-6 mb-8 md:-translate-x-12 xl:translate-x-0 relative origin-left">
            <div className="inline-block border-[1.5px] border-deep-rose/30 px-5 py-2 rounded-full bg-off-white/80 backdrop-blur-sm shadow-sm hover:scale-105 transition-transform cursor-default">
               <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-deep-rose font-bold">
                 Romance Reimagined
               </span>
            </div>
            <img src="/logo.png" alt="Aphrodite Logo" className="h-16 md:h-24 w-auto object-contain" />
          </div>
          
          <h1 className="font-serif text-[4.5rem] md:text-8xl lg:text-[7.5rem] xl:text-[8rem] leading-[0.95] text-deep-rose tracking-tight font-semibold flex flex-col">
            <span>Discover</span>
            <span className="italic text-primary-pink pl-0 lg:pl-16 relative group">
              Perfect
              <svg viewBox="0 0 100 100" className="absolute -top-4 -right-16 w-20 h-20 text-light-rose/60 hidden lg:block -z-10 group-hover:scale-125 transition-transform duration-300">
                 <circle cx="50" cy="50" r="48" fill="currentColor"/>
              </svg>
            </span>
            <a href="#flames" className="pl-0 lg:pl-32 hover:text-primary-pink transition-colors cursor-pointer z-20">
              Flames<span className="text-primary-pink animate-pulse inline-block">.</span>
            </a>
          </h1>
          
          <p className="mt-10 font-sans text-sm md:text-base leading-relaxed max-w-lg lg:ml-12 text-neutral-dark/80 font-medium md:px-8 lg:px-0">
            You don't need algorithms deciding your chemistry. Let serendipity guide you in an exclusive space built purely on affection and authenticity.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-6 items-center lg:ml-12 z-20">
            <button onClick={() => setCurrentPage('auth')} className="bg-deep-rose text-off-white font-sans text-xs uppercase tracking-[0.2em] font-bold px-10 py-5 rounded-full hover:bg-primary-pink transition-colors hover:-translate-y-1 transform active:scale-95 shadow-[0_8px_20px_-6px_rgba(158,58,68,0.5)]">
              Begin The Ritual
            </button>
            <a href="#discover" className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-deep-rose hover:text-primary-pink hover:underline underline-offset-4 decoration-primary-pink decoration-2 transition-all">
              Learn How It Works
            </a>
          </div>
        </div>

      </div>

      {/* Dynamic Marquee Ribbon - Positioned directly at the bottom bound of the hero viewport */}
      <Marquee />
      
    </section>
  );
}
