import { useState, useEffect } from 'react';
import Loading from './components/Loading';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Manifesto from './components/Manifesto';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'manifesto' | 'dashboard'>('home');

  // For nice, smooth reveals without causing layout jank
  useEffect(() => {
    if (isLoading) return;
    
    // Re-run observer when page changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoading, currentPage]);

  return (
    <>
      {isLoading ? (
        <Loading onComplete={() => setIsLoading(false)} />
      ) : (
        <main className="bg-off-white min-h-screen text-neutral-dark font-sans overflow-x-hidden selection:bg-primary-pink selection:text-off-white">
          <div className="noise-overlay fixed inset-0 pointer-events-none z-50"></div>
          
          {currentPage !== 'auth' && currentPage !== 'dashboard' && <Navbar setCurrentPage={setCurrentPage} />}

          <div className="perspective-container">
            {currentPage === 'auth' && <Auth setCurrentPage={setCurrentPage} />}
            
            {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} />}
            
            {currentPage === 'manifesto' && <Manifesto setCurrentPage={setCurrentPage} />}

            {currentPage === 'home' && (
              <>
                <Hero setCurrentPage={setCurrentPage} />

                {/* Discover Section with Parallax Intro */}
                <section id="discover" className="relative py-16 md:py-40 px-4 sm:px-6 md:px-12 bg-off-white overflow-hidden animate-on-scroll subtle-3d">
                 
                 {/* Subtle Parallax Background Shapes */}
                 <div 
                   className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-soft-blush rounded-full mix-blend-multiply filter blur-3xl opacity-70 z-0 pointer-events-none parallax-bg"
                   data-speed="0.05"
                 ></div>
                 <div 
                   className="absolute bottom-0 left-[0%] md:left-[-10%] w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] bg-light-rose rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none parallax-bg"
                   data-speed="-0.05"
                 ></div>

                 <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center relative z-10">
                   
                   <div className="w-full md:w-1/2 stagger-item text-center md:text-left">
                     <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-deep-rose mb-6 md:mb-8">
                       Beyond <br className="hidden md:block" /><span className="italic text-primary-pink">the screen.</span>
                     </h2>
                     <p className="text-neutral-dark/80 text-base md:text-lg leading-relaxed mb-4 md:mb-6 font-medium">
                       We believe romance isn't found by swiping on thousands of faces. It’s found in the delicate moments, the shared glances, and the intentional choices. 
                     </p>
                     <p className="text-neutral-dark/80 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-medium">
                       Aphrodite curates your dating pool based on psychological compatibility and aesthetic alignment, presenting you with only three highly compatible matches per week. Quality over noise.
                     </p>
                     <button onClick={() => setCurrentPage('manifesto')} className="inline-flex items-center text-deep-rose font-bold uppercase tracking-widest text-[10px] md:text-sm hover:text-primary-pink transition-colors group">
                       Read our manifesto
                       <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                     </button>
                   </div>

                   <div className="w-full md:w-1/2 relative stagger-item delay-1 mt-8 md:mt-0">
                     <div className="card-frame p-2 sm:p-4 bg-soft-blush rotate-1 sm:rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl parallax-bg" data-speed="0.02">
                        <img 
                          src="https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=1000&auto=format&fit=crop" 
                          alt="Abstract romantic aesthetic" 
                          className="w-full h-[350px] sm:h-[500px] object-cover grayscale-[20%] sepia-[20%] contrast-125 rounded filter brightness-110"
                        />
                     </div>
                     {/* Decorative Badge */}
                     <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 w-20 h-20 sm:w-24 sm:h-24 bg-primary-pink text-off-white rounded-full flex flex-col items-center justify-center rotate-[-15deg] shadow-lg pointer-events-none parallax-bg" data-speed="0.08">
                       <span className="font-serif italic text-xl sm:text-2xl">3</span>
                       <span className="text-[6px] sm:text-[8px] uppercase tracking-widest font-bold">Matches/Wk</span>
                     </div>
                   </div>

                 </div>
              </section>

              {/* Features Section */}
              <section id="features" className="py-16 md:py-24 bg-deep-rose text-off-white relative border-y border-neutral-dark/20 text-center animate-on-scroll subtle-3d">
                 <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-light-rose mb-4 md:mb-6 block font-bold stagger-item">The Aphrodite Experience</span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl mb-12 md:mb-16 italic stagger-item delay-1 leading-tight">Curated for the hopelessly romantic.</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 text-left">
                      
                      {/* Feature 1 */}
                      <div className="flex flex-col items-center md:items-start group hover:-translate-y-2 transition-transform duration-300 stagger-item delay-2">
                        <div className="w-16 h-16 rounded-full border border-light-rose/30 flex items-center justify-center mb-6 group-hover:bg-primary-pink transition-colors">
                          <span className="text-2xl text-light-rose">✧</span>
                        </div>
                        <h3 className="font-serif text-2xl mb-4 text-soft-blush">Slow Dating</h3>
                        <p className="text-off-white/70 text-sm leading-relaxed">
                          No endless feeds. We deliver a carefully selected handful of matches. Take your time to read their letters, admire their photos, and decide.
                        </p>
                      </div>

                      {/* Feature 2 */}
                      <div className="flex flex-col items-center md:items-start group hover:-translate-y-2 transition-transform duration-300 stagger-item delay-3">
                        <div className="w-16 h-16 rounded-full border border-light-rose/30 flex items-center justify-center mb-6 group-hover:bg-primary-pink transition-colors">
                          <span className="text-2xl text-light-rose">🕮</span>
                        </div>
                        <h3 className="font-serif text-2xl mb-4 text-soft-blush">Love Letters</h3>
                        <p className="text-off-white/70 text-sm leading-relaxed">
                          Skip the small talk. Connect by exchanging digital 'letters' that encourage depth, emotional vulnerability, and genuine interest.
                        </p>
                      </div>

                      {/* Feature 3 */}
                      <div className="flex flex-col items-center md:items-start group hover:-translate-y-2 transition-transform duration-300 stagger-item delay-4">
                        <div className="w-16 h-16 rounded-full border border-light-rose/30 flex items-center justify-center mb-6 group-hover:bg-primary-pink transition-colors">
                          <span className="text-2xl text-light-rose">🍷</span>
                        </div>
                        <h3 className="font-serif text-2xl mb-4 text-soft-blush">Physical Soirées</h3>
                        <p className="text-off-white/70 text-sm leading-relaxed">
                          Unlock invites to underground jazz nights, art exhibitions, and wine tastings designed specifically for Aphrodite members to mingle.
                        </p>
                      </div>

                    </div>
                 </div>
              </section>

              {/* FLAMES Framework Section */}
              <section id="flames" className="py-24 md:py-32 bg-soft-blush border-b border-deep-rose/20 overflow-hidden animate-on-scroll subtle-3d">
                <div className="noise-overlay opacity-30 z-0"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                  <div className="text-center mb-20 stagger-item">
                    <span className="font-sans text-xs uppercase tracking-[0.4em] text-deep-rose font-bold block mb-4">The Framework</span>
                    <h2 className="font-serif text-5xl md:text-7xl text-deep-rose italic">More than a game.</h2>
                  </div>
                  
                     <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 text-center px-2 md:px-4">
                    {[
                      { letter: 'F', word: 'Friends', desc: 'The unwavering foundation.' },
                      { letter: 'L', word: 'Lovers', desc: 'The passionate core.' },
                      { letter: 'A', word: 'Affectionate', desc: 'The gentle moments.' },
                      { letter: 'M', word: 'Marriage', desc: 'The commitment.' },
                      { letter: 'E', word: 'Enemies', desc: 'The playful banter.' },
                      { letter: 'S', word: 'Siblings', desc: 'The protective bond.' },
                    ].map((item, idx) => (
                      <div key={idx} className={`flex flex-col items-center group cursor-default stagger-item delay-${(idx % 6) + 1}`}>
                        <div className="text-6xl md:text-7xl lg:text-8xl font-serif text-deep-rose mb-4 md:mb-6 hover:text-primary-pink hover:-translate-y-4 hover:scale-110 transition-all duration-300">
                          {item.letter}
                        </div>
                        <div className="h-[1px] w-6 md:w-8 bg-primary-pink/50 group-hover:w-12 md:group-hover:w-16 group-hover:bg-deep-rose transition-all duration-500 mb-4 md:mb-6"></div>
                        <div className="h-24 md:h-32 overflow-hidden relative w-full pt-2">
                           <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-deep-rose mb-1 md:mb-2 font-medium">{item.word}</h3>
                           <p className="text-neutral-dark/80 text-[10px] md:text-xs lg:text-xs font-sans italic opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* About Us Section */}
              <section id="about-us" className="py-16 md:py-32 bg-off-white overflow-hidden animate-on-scroll subtle-3d">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                   <div className="text-center mb-16 md:mb-20 stagger-item">
                      <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-deep-rose font-bold block mb-3 md:mb-4">The Creators</span>
                      <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-deep-rose italic">Architects of Romance</h2>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 relative">
                      {/* Decorative line connecting people */}
                      <div className="hidden md:block absolute top-[35%] left-1/4 right-1/4 h-[0.5px] border-t border-dashed border-deep-rose/30"></div>

                      {/* Person 1 */}
                      <div className="flex flex-col items-center text-center group stagger-item delay-1">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-t-full rounded-b-[4px] bg-light-rose mb-6 md:mb-8 relative overflow-hidden border-[0.5px] border-deep-rose/30 shadow-[4px_4px_0_0_rgba(158,58,68,0.15)] flex items-center justify-center transition-colors duration-500">
                          <img src="/avatarS.png" alt="Shubham Upadhyay" className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-700 hover:scale-105" />
                        </div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-deep-rose mb-1 md:mb-2">Shubham Upadhyay</h3>
                        <p className="font-sans text-[8px] sm:text-[10px] uppercase tracking-widest text-primary-pink font-bold mb-3 md:mb-4">Co-Founder</p>
                        <p className="text-neutral-dark/80 text-xs sm:text-sm leading-relaxed max-w-sm px-4 md:px-0">Detailing the vision of modern romance. [More details perfectly poised to be added here soon, connecting logic to poetry.]</p>
                      </div>

                      {/* Person 2 */}
                      <div className="flex flex-col items-center text-center group stagger-item delay-2">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-t-full rounded-b-[4px] bg-light-rose mb-6 md:mb-8 relative overflow-hidden border-[0.5px] border-deep-rose/30 shadow-[4px_4px_0_0_rgba(158,58,68,0.15)] flex items-center justify-center transition-colors duration-500">
                          <img src="/avatarH.png" alt="Harshita Singh" className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-700 hover:scale-105" />
                        </div>
                        <h3 className="font-serif text-3xl font-medium text-deep-rose mb-2">Harshita Singh</h3>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-primary-pink font-bold mb-4">Co-Founder</p>
                        <p className="text-neutral-dark/80 text-sm leading-relaxed max-w-sm">Weaving elegance into every interaction. [More details perfectly poised to be added here soon, making the experience genuinely magical.]</p>
                      </div>
                   </div>
                </div>
              </section>
            </>
          )}

          {/* Footer - Always Visible except Auth */}
          {currentPage !== 'auth' && (
            <footer className="relative bg-deep-rose text-off-white py-16 px-6 md:px-12 overflow-hidden border-t-0">
               
               <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 font-sans relative z-10 pt-4">
                 <div className="md:w-1/2">
                 <div className="flex items-start md:items-center flex-col md:flex-row gap-5 mb-6">
                   <img src="/logo.png" alt="Aphrodite Logo" className="h-20 md:h-32 w-auto object-contain drop-shadow-lg" />
                   <h2 className="font-serif text-4xl md:text-5xl text-soft-blush italic pt-2 md:pt-0">Aphrodite</h2>
                 </div>
                 <p className="text-off-white/80 text-sm max-w-sm leading-relaxed mb-6">
                   Reimagining romance for the modern era. An exclusive digital sanctuary for those who still believe in love at first sight.
                 </p>
                 <div className="flex gap-4">
                   <a href="#" className="w-8 h-8 rounded-full bg-off-white/10 flex items-center justify-center text-off-white/70 hover:bg-primary-pink hover:text-off-white transition-colors">ig</a>
                   <a href="#" className="w-8 h-8 rounded-full bg-off-white/10 flex items-center justify-center text-off-white/70 hover:bg-primary-pink hover:text-off-white transition-colors">tw</a>
                   <a href="#" className="w-8 h-8 rounded-full bg-off-white/10 flex items-center justify-center text-off-white/70 hover:bg-primary-pink hover:text-off-white transition-colors">pi</a>
                 </div>
               </div>

               <div className="md:w-1/4">
                 <h4 className="text-xs uppercase tracking-widest text-white/50 font-bold mb-6">Support</h4>
                 <ul className="space-y-4 text-sm text-off-white/70">
                   <li><a href="#" className="hover:text-primary-pink transition-colors">Contact Us</a></li>
                   <li><a href="#" className="hover:text-primary-pink transition-colors">Privacy Policy</a></li>
                   <li><a href="#" className="hover:text-primary-pink transition-colors">Terms of Service</a></li>
                 </ul>
               </div>
             </div>

             <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-off-white/10 text-center flex flex-col md:flex-row justify-between items-center text-xs text-off-white/50 relative z-10">
               <p>© 2026 Aphrodite Dating. All rights reserved.</p>
               <p className="mt-4 md:mt-0 tracking-widest uppercase">Made with ♥ in Paris</p>
             </div>
             
             {/* Huge background text */}
             <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 text-[15vw] font-serif font-bold text-off-white/5 whitespace-nowrap pointer-events-none -z-0">
               ROMANCE
             </div>
          </footer>
          )}
          </div>
        </main>
      )}
    </>
  );
}

export default App;
