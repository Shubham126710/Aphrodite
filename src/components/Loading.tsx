import { useEffect, useState } from 'react';

export default function Loading({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Animate progress 0 -> 100
    const duration = 2500; // 2.5 seconds fill
    const intervalTime = 20; 
    const step = 100 / (duration / intervalTime);
    
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        
        // Start fading out after fill is complete
        setTimeout(() => {
          setIsFading(true);
          setTimeout(onComplete, 800); // Trigger app swap after fade
        }, 500); // 0.5s pause at 100%
      }
      setProgress(current);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-off-white z-50 flex items-center justify-center transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center">
        
        {/* Heart Loading Animation */}
        <div className="relative w-24 h-24 mb-6">
          {/* Outline heart */}
          <svg viewBox="0 0 24 24" className="w-full h-full text-light-rose" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          
          {/* Filled heart with clipping mask linked to progress */}
          <div 
             className="absolute bottom-0 left-0 right-0 overflow-hidden transition-all duration-75 ease-linear" 
             style={{ height: `${progress}%` }}
          >
             <svg viewBox="0 0 24 24" className="w-24 h-24 absolute bottom-0 left-0 text-primary-pink" fill="currentColor" stroke="none">
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
             </svg>
          </div>
        </div>
        
        <h1 className="font-serif italic text-3xl md:text-5xl text-deep-rose tracking-widest font-medium">
          Aphrodite
        </h1>
        
        {/* Delicate percentage + dynamic text */}
        <div className="font-sans text-[10px] tracking-[0.3em] text-neutral-dark mt-6 uppercase flex flex-col items-center space-y-2">
          <span>{Math.floor(progress)}% — Igniting Flame</span>
        </div>

      </div>
    </div>
  );
}
