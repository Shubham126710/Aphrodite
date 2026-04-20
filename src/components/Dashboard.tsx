import { useState } from 'react';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  image: string;
  personality: string;
}

const mockProfiles: Profile[] = [
  { id: 1, name: 'Emma', age: 24, location: 'New York', bio: 'Art gallery enthusiast and amateur chef. Looking for someone to share Sunday brunches with.', image: '/avatar1.png', personality: 'Creative' },
  { id: 2, name: 'James', age: 27, location: 'London', bio: 'Tech startup founder. When not coding, I am climbing literal mountains.', image: '/avatar2.png', personality: 'Adventurous' },
  { id: 3, name: 'Olivia', age: 25, location: 'Paris', bio: 'Avid reader, terrible dancer. Tell me your favorite obscure novel.', image: '/avatar3.png', personality: 'Intellectual' },
  { id: 4, name: 'Liam', age: 28, location: 'Berlin', bio: 'Musician and coffee addict. Will probably write a song about you.', image: '/avatar4.png', personality: 'Passionate' },
  { id: 5, name: 'Sophia', age: 23, location: 'Rome', bio: 'Fashion designer finding inspiration in old cinema and modern romance.', image: '/avatar5.png', personality: 'Romantic' },
  { id: 6, name: 'Noah', age: 29, location: 'Tokyo', bio: 'Architect with a weak spot for mid-century design and rescue dogs.', image: '/avatar6.png', personality: 'Driven' },
  { id: 7, name: 'Isabella', age: 26, location: 'Toronto', bio: 'Yoga instructor chasing sunsets. Fluent in sarcasm and poetry.', image: '/avatar7.png', personality: 'Mindful' },
  { id: 8, name: 'Elijah', age: 30, location: 'Sydney', bio: 'Writer seeking a muse. Preferably one who enjoys long coastal drives.', image: '/avatar8.png', personality: 'Thoughtful' }
];

const flamesOutcomes = [
  { letter: 'F', word: 'Friends', desc: 'A beautiful platonic connection. Perfect for late-night chats.' },
  { letter: 'L', word: 'Lovers', desc: 'Sparks are flying! Passion naturally flows between you two.' },
  { letter: 'A', word: 'Affection', desc: 'A gentle, caring bond. You bring out the best in each other.' },
  { letter: 'M', word: 'Marriage', desc: 'Soulmate potential. The stars align perfectly for this match.' },
  { letter: 'E', word: 'Enemies', desc: 'A fiery dynamic! The tension between you is palpable.' },
  { letter: 'S', word: 'Siblings', desc: 'A familiar, comforting energy, like you have known each other forever.' }
];

export interface DashboardProps {
  setCurrentPage: (page: 'home' | 'auth' | 'manifesto' | 'dashboard') => void;
}

export default function Dashboard({ setCurrentPage }: DashboardProps) {
  const [tourStep, setTourStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matchData, setMatchData] = useState<{ profile: Profile, outcome: typeof flamesOutcomes[0], score: number, distribution: Record<string, number> } | null>(null);
  const [swipeState, setSwipeState] = useState<'idle' | 'left' | 'right'>('idle');
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [view, setView] = useState<'swipe' | 'chat'>('swipe');
  const [chatPartner, setChatPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<{sender: 'me' | 'them', text: string}[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only process if mouse is pressed
    setDragOffset(prev => prev + e.movementX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (dragOffset > 100) {
      handleSwipe('right');
    } else if (dragOffset < -100) {
      handleSwipe('left');
    } else {
      setDragOffset(0); // Snap back
    }
  };

  const calculateFlames = (profile: Profile) => {
    // Generate a distribution that sums to 100
    let remaining = 100;
    const distribution: Record<string, number> = {};
    const randomizedOutcomes = [...flamesOutcomes].sort(() => 0.5 - Math.random());
    
    // Assign highest to the first to guarantee it's the winner
    const topScore = Math.floor(Math.random() * 30) + 50; // 50-80%
    distribution[randomizedOutcomes[0].word] = topScore;
    remaining -= topScore;
    
    for (let i = 1; i < randomizedOutcomes.length; i++) {
        if (i === randomizedOutcomes.length - 1) {
            distribution[randomizedOutcomes[i].word] = remaining;
        } else {
            const share = Math.floor(Math.random() * (remaining / 2));
            distribution[randomizedOutcomes[i].word] = share;
            remaining -= share;
        }
    }
    
    setMatchData({ profile, outcome: randomizedOutcomes[0], score: topScore, distribution });
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (swipeState !== 'idle') return;
    setSwipeState(direction);
    setDragOffset(direction === 'right' ? 300 : -300); // Visual follow-through
    
    setTimeout(() => {
      const profile = mockProfiles[currentIndex];
      
      // If Right Swipe, higher chance of a Match triggering the FLAMES score
      if (direction === 'right' && Math.random() > 0.4) {
        calculateFlames(profile);
      } else {
        if (currentIndex < mockProfiles.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0); // loop for demo
        }
      }
      setSwipeState('idle');
      setDragOffset(0);
    }, 400); // Wait for transition
  };

  const handleCloseMatch = () => {
    setMatchData(null);
    if (currentIndex < mockProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleStartChat = () => {
     if (matchData) {
         setChatPartner(matchData.profile);
         setMessages([{ sender: 'them', text: `Hi there! I saw we matched under ${matchData.outcome.word}. What do you think about that? 👀` }]);
     }
     setMatchData(null);
     setView('chat');
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    if (!input.value.trim()) return;
    const msg = input.value;
    input.value = '';
    setMessages(prev => [...prev, { sender: 'me', text: msg }]);
    
    // Mock response back
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'them', text: 'Haha, that is so interesting! Tell me more ✨' }]);
    }, 1500);
  };

  // Tour Questionnaire Steps
  const questions = [
    { title: "What's your ideal Friday night?", options: ['A quiet dinner', 'Dancing until dawn', 'Reading a good book', 'A spontaneous road trip'] },
    { title: "How would your friends describe you?", options: ['The planner', 'The wild card', 'The listener', 'The comedian'] },
    { title: "What matters most in love?", options: ['Loyalty', 'Passion', 'Shared humor', 'Growth'] },
    { title: "Which element speaks to you?", options: ['Fire (passion, energy)', 'Water (emotion, depth)', 'Earth (stability, grounding)', 'Air (intellect, freedom)'] },
    { title: "Your perfect vacation destination?", options: ['A secluded cabin', 'A bustling city', 'A tropical beach', 'A historical ruins tour'] },
    { title: "How do you handle conflict?", options: ['Talk it out immediately', 'Need time to process', 'Write a letter/message', 'Compromise quickly'] },
    { title: "What's your love language?", options: ['Words of Affirmation', 'Physical Touch', 'Quality Time', 'Acts of Service'] },
    { title: "Choose a movie genre for tonight:", options: ['Romantic Comedy', 'Psychological Thriller', 'Action & Adventure', 'Documentary'] },
    { title: "Your morning routine?", options: ['Hit snooze 3 times', 'Up early, hitting the gym', 'Slow coffee and news', 'Rushing out the door'] },
    { title: "What is your biggest dealbreaker?", options: ['Dishonesty', 'Lack of ambition', 'Poor communication', 'Clinginess'] },
    { title: "How do you express affection?", options: ['Surprise gifts', 'Cooking a meal', 'Deep conversations', 'Physical closeness'] },
    { title: "What's your preferred first date?", options: ['Coffee shop chat', 'Dinner at a nice restaurant', 'An activity (mini-golf, arcade)', 'A scenic walk'] }
  ];

  const handleAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [tourStep]: option }));
    if (tourStep < questions.length) {
      setTourStep(prev => prev + 1);
    }
  };

  // 1. Render Welcome Tour
  if (tourStep < questions.length) {
    const q = questions[tourStep];
    return (
      <div className="min-h-screen bg-soft-blush flex items-center justify-center p-4 relative z-50">
        <div className="max-w-xl w-full bg-off-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(158,58,68,0.2)] border border-deep-rose/10 animate-fade-in text-center relative overflow-hidden">
          <div className="mb-8">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-deep-rose mb-3 font-bold">Welcome Tour {tourStep + 1}/{questions.length}</h4>
            <h2 className="font-serif text-3xl md:text-4xl text-neutral-dark italic">{q.title}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleAnswer(opt)}
                className="py-4 px-6 border-[1.5px] border-deep-rose/20 rounded-full hover:border-deep-rose hover:bg-deep-rose/5 transition-all text-neutral-dark uppercase tracking-widest text-[11px] font-medium"
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="absolute top-0 left-0 w-full h-1 bg-deep-rose/10">
            <div className="h-full bg-deep-rose transition-all duration-500" style={{ width: `${(tourStep / questions.length) * 100}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Main Dashboard (Swipe Interface)
  if (view === 'chat' && chatPartner) {
    return (
      <div className="min-h-screen bg-soft-blush flex flex-col pt-24 md:pt-32 pb-6 px-4 relative max-w-lg mx-auto animate-fade-in shadow-[0_0_50px_-10px_rgba(0,0,0,0.05)] border-x border-deep-rose/5 bg-off-white/80 backdrop-blur-md">
         {/* Chat Header */}
         <div className="absolute top-6 w-full left-0 px-8 flex justify-between items-center z-10">
           <button onClick={() => setView('swipe')} className="w-10 h-10 rounded-full border border-deep-rose/20 flex items-center justify-center text-deep-rose hover:bg-deep-rose/5 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div className="flex flex-col items-center">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-deep-rose/20 bg-soft-blush">
               <img src={chatPartner.image} alt={chatPartner.name} className="w-full h-full object-cover mix-blend-multiply" />
             </div>
             <span className="font-serif text-neutral-dark italic mt-1">{chatPartner.name}</span>
           </div>
           <div className="w-10 h-10 flex items-center justify-center opacity-50">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
           </div>
         </div>
         
         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4 px-2 mb-20 scrollbar-hide shrink-0" style={{ maxHeight: 'calc(100vh - 200px)'}}>
            <p className="text-center text-[9px] uppercase tracking-widest text-neutral-dark/40 my-4 font-bold">You matched today</p>
            {messages.map((msg, i) => (
              <div key={i} className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[75%] p-4 text-sm leading-relaxed rounded-[24px] ${
                   msg.sender === 'me' 
                     ? 'bg-deep-rose text-off-white rounded-br-[4px]' 
                     : 'bg-white border border-deep-rose/10 text-neutral-dark rounded-bl-[4px] shadow-sm'
                 }`}>
                   {msg.text}
                 </div>
              </div>
            ))}
         </div>

         {/* Chat Input */}
         <form onSubmit={handleSendMessage} className="absolute bottom-6 left-4 right-4 flex gap-2">
            <input 
              name="message"
              type="text" 
              placeholder={`Message ${chatPartner.name}...`} 
              className="flex-1 bg-white p-4 rounded-full border border-deep-rose/20 outline-none focus:border-deep-rose transition-colors text-sm shadow-sm placeholder:text-neutral-dark/30"
              autoComplete="off"
            />
            <button type="submit" className="w-12 h-12 shrink-0 bg-deep-rose rounded-full flex items-center justify-center text-off-white hover:scale-105 transition-transform shadow-lg">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 -ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
         </form>
      </div>
    );
  }

  const currentProfile = mockProfiles[currentIndex];
  
  return (
    <div className="min-h-screen bg-soft-blush flex flex-col pt-24 md:pt-32 pb-12 px-4 relative">
      
      {/* Small Header specifically for dashboard */}
      <div className="absolute top-6 w-full left-0 px-4 md:px-8 flex justify-between items-center z-[60]">
        <div className="font-serif text-deep-rose italic tracking-widest text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('home')}>
          Aphrodite
        </div>
        
        <div className="hidden md:flex bg-white/50 backdrop-blur-md rounded-full px-6 py-2 border border-deep-rose/10 gap-6 items-center shadow-sm">
            <button onClick={() => setView('swipe')} className={`font-sans text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 ${view === 'swipe' ? 'text-deep-rose' : 'text-neutral-dark/60 hover:text-deep-rose'}`}>Explore</button>
            <button onClick={() => {}} className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-dark/60 hover:text-deep-rose transition-all hover:scale-105">Matches</button>
            <button onClick={() => {}} className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-dark/60 hover:text-deep-rose transition-all hover:scale-105">Stats</button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-deep-rose/10 flex items-center justify-center border border-deep-rose/20 cursor-pointer hover:bg-deep-rose hover:text-white transition-colors group">
             <span className="text-deep-rose group-hover:text-white font-bold text-[10px] md:text-xs uppercase transition-colors">Me</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-[400px] mx-auto">
        
        {/* Match / Flames Pop-up Modal */}
        {matchData && (
          <div className="fixed inset-0 bg-off-white/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-soft-blush w-full max-w-md rounded-[40px] p-8 md:p-12 text-center shadow-2xl border border-deep-rose/20 flex flex-col items-center relative overflow-hidden">
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-deep-rose/10 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-pink/10 rounded-full blur-3xl pointer-events-none"></div>

               <h2 className="font-serif text-5xl md:text-6xl text-deep-rose mb-2 font-bold rotate-[-2deg]">{matchData.outcome.word}</h2>
               <h3 className="font-sans text-xs uppercase tracking-[0.3em] font-bold text-neutral-dark/60 mb-6">{matchData.score}% COMPATIBILITY</h3>

               <div className="flex items-center gap-6 mb-8 relative z-10">
                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-off-white shadow-xl overflow-hidden">
                    <img src="/avatar1.png" alt="You" className="w-full h-full object-cover mix-blend-multiply bg-soft-blush" />
                 </div>
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-deep-rose flex py-2 items-center justify-center shadow-lg transform -rotate-12">
                   <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 md:w-6 md:h-6"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                 </div>
                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-off-white shadow-xl overflow-hidden">
                    <img src={matchData.profile.image} alt={matchData.profile.name} className="w-full h-full object-cover mix-blend-multiply bg-soft-blush" />
                 </div>
               </div>

               <p className="text-neutral-dark text-xs md:text-sm leading-relaxed mb-6 mx-auto max-w-[280px]">
                 {matchData.outcome.desc}
               </p>

               {/* Extended Distribution Stats */}
               <div className="w-full max-w-[280px] flex flex-col gap-2 mb-8">
                  {Object.entries(matchData.distribution)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([verb, percent], idx) => (
                    <div key={verb} className="w-full flex items-center justify-between text-[10px] md:text-xs">
                       <span className={`uppercase tracking-widest ${idx === 0 ? 'text-deep-rose font-bold' : 'text-neutral-dark/60 font-medium'}`}>{verb}</span>
                       <div className="flex-1 mx-3 h-[4px] bg-deep-rose/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${idx === 0 ? 'bg-deep-rose' : 'bg-primary-pink/50'}`} style={{ width: `${percent}%` }}></div>
                       </div>
                       <span className="font-bold font-sans text-neutral-dark/80">{percent}%</span>
                    </div>
                  ))}
               </div>

               <div className="w-full flex gap-3">
                 <button 
                   onClick={handleStartChat}
                   className="flex-1 py-3 bg-deep-rose text-off-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-dark transition-colors shadow-lg flex items-center justify-center gap-2"
                 >
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                   Chat
                 </button>
                 <button 
                   onClick={handleCloseMatch}
                   className="flex-1 py-3 border border-deep-rose/20 text-deep-rose rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-deep-rose/5 transition-colors"
                 >
                   Keep Swiping
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Swipe Card Deck */}
        <div className="relative w-full aspect-[3/4] mb-8" style={{ perspective: '1000px' }}>
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute inset-0 bg-off-white rounded-[32px] shadow-[0_20px_40px_-15px_rgba(158,58,68,0.2)] border border-deep-rose/10 overflow-hidden cursor-grab active:cursor-grabbing transform-gpu
              ${swipeState !== 'idle' ? 'transition-transform duration-500 ease-out' : ''}
              ${swipeState === 'left' ? '-translate-x-[150%] -rotate-12 opacity-0' : ''}
              ${swipeState === 'right' ? 'translate-x-[150%] rotate-12 opacity-0' : ''}
            `}
            style={{
              transform: swipeState === 'idle' ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)` : undefined
            }}
          >
             <img src={currentProfile.image} alt={currentProfile.name} className="w-full h-[65%] object-cover bg-soft-blush pointer-events-none" />
             
             {/* Gradient overlay for text readability */}
             <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-off-white via-off-white/80 to-transparent pointer-events-none"></div>
             
             <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 pt-0 flex flex-col justify-end">
               <div className="flex justify-between items-end mb-2">
                 <h2 className="font-serif text-3xl font-medium text-neutral-dark">{currentProfile.name}, <span className="text-2xl text-neutral-dark/70 font-normal">{currentProfile.age}</span></h2>
               </div>
               <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-deep-rose mb-3">
                 {currentProfile.personality} • {currentProfile.location}
               </p>
               <p className="text-neutral-dark/80 text-sm leading-relaxed line-clamp-3">
                 {currentProfile.bio}
               </p>
             </div>
          </div>
        </div>

        {/* Swipe Controls */}
        <div className="flex gap-6 justify-center items-center w-full z-10">
          <button 
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-off-white border-[1.5px] border-deep-rose/20 shadow-lg flex items-center justify-center hover:bg-soft-blush hover:scale-110 transition-all group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-neutral-dark group-hover:text-deep-rose transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Match Button */}
          <button 
            onClick={() => handleSwipe('right')}
            className="w-20 h-20 rounded-full bg-deep-rose shadow-[0_15px_30px_-10px_rgba(158,58,68,0.5)] flex items-center justify-center hover:scale-110 transition-all hover:bg-neutral-dark group"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 group-hover:scale-110 transition-transform">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}