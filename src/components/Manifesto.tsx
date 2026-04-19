
export interface ManifestoProps {
  setCurrentPage: (page: 'home' | 'auth' | 'manifesto') => void;
}

export default function Manifesto({ setCurrentPage }: ManifestoProps) {
  return (
    <div className="bg-off-white text-neutral-dark min-h-screen relative font-serif">
      <div className="noise-overlay opacity-40"></div>
      
      <div className="max-w-[800px] mx-auto px-6 py-24 md:py-32 relative z-10">
        
        {/* Navigation Return */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-deep-rose hover:text-primary-pink transition-colors mb-12 flex items-center group"
          aria-label="Return home"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Return
        </button>

        {/* Manifesto Content */}
        <article className="animate-on-scroll opacity-0 translate-y-8 duration-1000 delay-100">
          
          <header className="mb-16 md:mb-24 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl italic text-deep-rose font-medium tracking-tight leading-tight mb-8">
              A Love Letter to Romance.
            </h1>
            <div className="w-24 h-[1px] bg-deep-rose/30 mx-auto md:mx-0"></div>
            <p className="mt-8 font-sans text-xs uppercase tracking-[0.3em] font-bold text-neutral-dark/60">
              The Aphrodite Manifesto
            </p>
          </header>

          <section className="space-y-12 md:space-y-16 text-lg md:text-2xl leading-relaxed md:leading-loose text-neutral-dark/90">
            <p className="first-letter:text-7xl first-letter:italic first-letter:text-deep-rose first-letter:mr-3 first-letter:float-left">
              We live in a world obsessed with speed, optimization, and the relentless pursuit of the "next best thing." Swiping left and right has reduced the profound search for human connection into a dopamine-fueled game of slot machines. This profoundly cheapens the beauty, mystery, and serendipity of romance.
            </p>

            <p>
              We believe love is not an algorithm to be solved. Love is an experience, an unfolding tapestry of shared glances, unspoken understandings, and the slow reveal of a soul. It requires patience. It requires investment. It requires a setting worthy of its gravity.
            </p>

            <blockquote className="border-l-[1.5px] border-primary-pink pl-6 md:pl-10 py-2 my-16 text-3xl md:text-4xl italic text-deep-rose font-medium leading-snug bg-gradient-to-r from-soft-blush/20 to-transparent">
              "To find love is to step out of the loud, chaotic marketplace and into a quiet, sacred room."
            </blockquote>

            <p>
              Aphrodite was created as a rebellion against the fleeting. We have designed a digital sanctuary where intent matters more than volume. We slow down the process, deliberately creating friction to filter out those who are not serious about finding a lasting connection.
            </p>

            <p>
              We are not for everyone. And that is exactly the point. We are for those who still believe in poetry, in handwritten letters, in the kind of romance that lingers long after the night has ended. We are returning courtship to its rightful pedestal.
            </p>

            <p className="font-medium text-deep-rose pt-12 text-xl md:text-3xl italic">
              Welcome to the renaissance of romance.
            </p>
          </section>

          <footer className="mt-24 pt-12 border-t-[0.5px] border-deep-rose/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="flex flex-col text-right">
                 <span className="font-serif italic text-2xl md:text-3xl text-deep-rose mb-1">XOXO,</span>
                 <span className="font-sans text-[10px] md:text-xs uppercase tracking-widest text-neutral-dark font-bold whitespace-nowrap">Shubham & Harshita</span>
               </div>
               <img src="/logo.png" alt="Aphrodite Seal" className="h-20 md:h-28 w-auto object-contain opacity-90" />
            </div>
            
            <button 
              onClick={() => setCurrentPage('auth')}
              className="bg-deep-rose text-off-white font-sans text-xs uppercase tracking-[0.2em] font-bold px-10 py-5 rounded-full hover:bg-primary-pink transition-all hover:-translate-y-1 transform active:scale-95 shadow-[0_8px_20px_-6px_rgba(158,58,68,0.5)]"
            >
              Apply For Membership
            </button>
          </footer>

        </article>
      </div>
    </div>
  );
}