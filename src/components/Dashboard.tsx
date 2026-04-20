import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface Profile {
  id: number | string;
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

import type { UserProfileData } from '../App';

export interface DashboardProps {
  userProfile: UserProfileData | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
  setCurrentPage: (page: 'home' | 'auth' | 'manifesto' | 'dashboard') => void;
}

export default function Dashboard({ setCurrentPage, userProfile, setUserProfile }: DashboardProps) {
  const [tourStep, setTourStep] = useState<number>(userProfile?.hasCompletedTour ? 15 : 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Re-eval when profile finally loads
  
  useEffect(() => {
    if (userProfile?.hasCompletedTour) {
      setTourStep(15);
    }
  }, [userProfile?.hasCompletedTour]);
  // @ts-expect-error unused
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matchData, setMatchData] = useState<{ profile: Profile, outcome: typeof flamesOutcomes[0], score: number, distribution: Record<string, number> } | null>(null);
  const [swipeState, setSwipeState] = useState<'idle' | 'left' | 'right'>('idle');
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [view, setView] = useState<'swipe' | 'chat' | 'matches' | 'stats' | 'profile'>('swipe');
  const [chatPartner, setChatPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<{sender: 'me' | 'them', text: string}[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(mockProfiles);

  // Fetch real users from Supabase securely if possible
  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        // Safely fetch public profiles if they exist in the DB
        const { data } = await supabase.from('profiles').select('*').limit(20);
        if (data && data.length > 0) {
          const realUsers = data.map(p => ({
            id: p.id,
            name: p.first_name + (p.last_name ? ' ' + p.last_name : ''),
            age: p.age || 25,
            location: p.location || 'Globe',
            bio: p.bio || 'Exploring the world.',
            image: p.avatar_url || '/avatar1.png',
            personality: p.hobbies || 'Mystery'
          }));
          setAllProfiles([...mockProfiles, ...realUsers.filter(u => u.id !== userProfile?.id)]);
        }
      } catch (e) {
        // Fallback gracefully without breaking if table doesn't exist
      }
    };
    fetchRealUsers();
  }, [userProfile?.id]);

  // Real-time Chat Subscription
  useEffect(() => {
    if (!chatPartner || typeof chatPartner.id === 'number') return;
    if (!userProfile?.id) return;
    
    // Subscribe to new messages addressed to me
    const channel = supabase.channel('realtime_chat')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${userProfile.id}`
      }, payload => {
        if (payload.new.sender_id === chatPartner.id) {
           setMessages(prev => [...prev, { sender: 'them', text: payload.new.content }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatPartner, userProfile?.id]);


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

  const computeCompatibilityMetrics = (user: UserProfileData | null, target: Profile) => {
    // Advanced NLP-like substring matching algorithm checking shared hobbies/locations/bios
    const myBio = `${user?.bio || ''} ${user?.hobbies || ''} ${user?.location || ''}`.toLowerCase();
    const theirBio = `${target.bio} ${target.personality} ${target.location}`.toLowerCase();
    
    const myWords = myBio.split(/\s+/).filter(w => w.length > 3);
    const theirWords = theirBio.split(/\s+/).filter(w => w.length > 3);
    
    let overlapCount = 0;
    myWords.forEach(w => { if (theirWords.includes(w)) overlapCount++; });
    
    // A more genuine cancellation algorithm that accounts for deeper personality markers
    let str1 = ((user?.firstName || 'Guest') + (user?.lastName || '')).toLowerCase().replace(/[^a-z]/g, '').split('');
    let str2 = target.name.toLowerCase().replace(/[^a-z]/g, '').split('');
    
    for (let i = 0; i < str1.length; i++) {
      if (str1[i] === '') continue;
      for (let j = 0; j < str2.length; j++) {
        if (str1[i] === str2[j]) {
          str1[i] = ''; str2[j] = '';
          break;
        }
      }
    }

    let remainingCount = str1.filter(c => c !== '').length + str2.filter(c => c !== '').length;
    // Lower remaining count means better match + bonus for overlapping life variables
    remainingCount = Math.max(1, remainingCount - (overlapCount * 2)); 
    
    let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    let index = 0;
    while (flames.length > 1) {
      index = (index + remainingCount - 1) % flames.length;
      flames.splice(index, 1);
    }
    
    // Generates a base score depending on the FLAMES result and boosts via overlap multipliers
    let baseScore = 0;
    if (flames[0] === 'L' || flames[0] === 'M') baseScore = 75;
    else if (flames[0] === 'A' || flames[0] === 'F') baseScore = 60;
    else baseScore = 40;
    
    return {
      letter: flames[0],
      score: Math.min(99, baseScore + (overlapCount * 6) + Math.floor(Math.random() * 15))
    };
  };

  const calculateFlames = (profile: Profile) => {
    const metrics = computeCompatibilityMetrics(userProfile, profile);
    const winningOutcome = flamesOutcomes.find(o => o.letter === metrics.letter) || flamesOutcomes[0];
    
    let remaining = 100;
    const distribution: Record<string, number> = {};
    distribution[winningOutcome.word] = metrics.score;
    remaining -= metrics.score;
    
    const others = flamesOutcomes.filter(o => o.letter !== metrics.letter).sort(() => 0.5 - Math.random());
    for (let i = 0; i < others.length; i++) {
        if (i === others.length - 1) {
            distribution[others[i].word] = remaining;
        } else {
            const share = Math.floor(Math.random() * (remaining / 2));
            distribution[others[i].word] = share;
            remaining -= share;
        }
    }
    
    setMatchData({ profile, outcome: winningOutcome, score: metrics.score, distribution });
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (swipeState !== 'idle') return;
    setSwipeState(direction);
    setDragOffset(direction === 'right' ? 300 : -300); // Visual follow-through
    
    setTimeout(() => {
      const profile = allProfiles[currentIndex];
      
      // If Right Swipe, higher chance of a Match triggering the FLAMES score
      if (direction === 'right' && Math.random() > 0.4) {
        calculateFlames(profile);
      } else {
        if (currentIndex < allProfiles.length - 1) {
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
    if (currentIndex < allProfiles.length - 1) {
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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    if (!input.value.trim() || !chatPartner) return;
    
    const msg = input.value;
    input.value = '';
    setMessages(prev => [...prev, { sender: 'me', text: msg }]);
    
    const isFakeUser = typeof chatPartner.id === 'number';

    if (isFakeUser) {
        // ML Model integration for natural fake user replies
        setTimeout(async () => {
            try {
                const seed = Math.floor(Math.random() * 1000000);
                const queryContext = encodeURIComponent(`You are ${chatPartner.name}, a fun user on a dating app called Aphrodite. Read this message: "${msg}". Give a very brief, natural, chill, dating-app style text reply. No quotes, no intro. Avoid robotic AI talk.`);
                const aiResponse = await fetch(`https://text.pollinations.ai/${queryContext}?seed=${seed}&model=openai`);
                const replyText = await aiResponse.text();
                const cleanReply = replyText.replace(/^"|"$/g, '').trim();
                setMessages(prev => [...prev, { sender: 'them', text: cleanReply }]);
            } catch (e) {
                setMessages(prev => [...prev, { sender: 'them', text: "haha that's so valid" }]);
            }
        }, 500);
    } else {
        // LIVE REAL USER MESSAGE INSERTION!
        try {
            await supabase.from('messages').insert({
                sender_id: userProfile?.id,
                receiver_id: chatPartner.id,
                content: msg
            });
        } catch (err) {
            console.error('Failed to send live message', err);
        }
    }
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
    { title: "What's your preferred first date?", options: ['Coffee shop chat', 'Dinner at a nice restaurant', 'An activity (mini-golf, arcade)', 'A scenic walk'] },
    { title: "What's an ideal Sunday morning?", options: ['Sleeping in late', 'Farmer\'s market run', 'Intense workout', 'Brunch with friends'] },
    { title: "Your philosophy on life?", options: ['Go with the flow', 'Plan for the future', 'Live for today', 'Seek knowledge'] },
    { title: "What kind of pet do you prefer?", options: ['A loyal dog', 'An independent cat', 'Something exotic', 'No pets right now'] }
  ];

  const handleAnswer = (option: string) => {
    setAnswers(prev => ({ ...prev, [tourStep]: option }));
    if (tourStep < questions.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      setTourStep(questions.length);
      if (setUserProfile && userProfile) {
        setUserProfile({ ...userProfile, hasCompletedTour: true });
          supabase.auth.updateUser({
            data: { hasCompletedTour: true }
          }).catch(err => console.error(err));
      } else if (setUserProfile) {
        setUserProfile({ id: 'guest', firstName: 'Guest', lastName: '', avatarUrl: '/avatar1.png', hasCompletedTour: true });
      }
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

  
    // 5. Render Profile Customization
    if (view === 'profile') {
      return (
        <div className="min-h-screen bg-soft-blush flex flex-col pt-12 p-4 relative max-w-lg mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center py-4 z-10 w-full mb-4 text-neutral-dark">
             <button onClick={() => setView('swipe')} className="rounded-full w-12 h-12 border border-deep-rose/20 flex items-center justify-center text-deep-rose transition-all hover:bg-deep-rose hover:text-white bg-off-white/80 shadow-sm">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 -ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
             </button>
             <h2 className="font-serif text-2xl md:text-3xl italic mx-auto text-center translate-x-[-24px] text-deep-rose">My Profile</h2>
          </div>
          
          <div className="bg-off-white shadow-[0_20px_40px_-15px_rgba(158,58,68,0.2)] rounded-[40px] p-8 border border-deep-rose/10 mx-2 flex-1 overflow-y-auto w-full relative mb-6">
             <div className="absolute top-0 right-0 w-32 h-32 bg-deep-rose/5 rounded-bl-[100px] pointer-events-none"></div>
             
             <div className="flex flex-col items-center mb-8 relative z-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-[4px] border-white shadow-xl mb-4 bg-deep-rose/5 relative">
                     <img src={userProfile?.avatarUrl || "/avatar1.png"} alt="My Avatar" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="absolute bottom-4 right-0 w-8 h-8 bg-primary-pink text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white pointer-events-none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                </div>
                <h3 className="font-serif text-3xl text-neutral-dark italic">{userProfile?.firstName} {userProfile?.lastName}</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-dark/40 mt-2">Verified Member</p>
             </div>
             
             <div className="space-y-6 relative z-10 mb-8">
               <div className="group">
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-deep-rose mb-3">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                   About Me
                 </label>
                 <textarea 
                   className="w-full bg-soft-blush/30 border border-deep-rose/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-deep-rose/40 focus:bg-soft-blush/50 min-h-[120px] transition-all resize-none placeholder:text-neutral-dark/30 text-neutral-dark/80"
                   placeholder="Your story begins here..."
                   value={userProfile?.bio || ''}
                   onChange={e => setUserProfile?.(prev => prev ? {...prev, bio: e.target.value} : null)}
                 />
               </div>
               
               <div className="group">
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-deep-rose mb-3">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Hobbies & Interests
                 </label>
                 <input 
                   type="text"
                   className="w-full bg-soft-blush/30 border border-deep-rose/10 rounded-full px-5 py-4 text-sm focus:outline-none focus:border-deep-rose/40 focus:bg-soft-blush/50 transition-all placeholder:text-neutral-dark/30 text-neutral-dark/80"
                   placeholder="e.g. Hiking, Cooking, Art, Indie Films"
                   value={userProfile?.hobbies || ''}
                   onChange={e => setUserProfile?.(prev => prev ? {...prev, hobbies: e.target.value} : null)}
                 />
               </div>
               
               <div className="group">
                 <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-deep-rose mb-3">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   Location
                 </label>
                 <input 
                   type="text"
                   className="w-full bg-soft-blush/30 border border-deep-rose/10 rounded-full px-5 py-4 text-sm focus:outline-none focus:border-deep-rose/40 focus:bg-soft-blush/50 transition-all placeholder:text-neutral-dark/30 text-neutral-dark/80"
                   placeholder="City, Country"
                   value={userProfile?.location || ''}
                   onChange={e => setUserProfile?.(prev => prev ? {...prev, location: e.target.value} : null)}
                 />
               </div>
             </div>
               
             <button onClick={() => {
                 setView('swipe');
                 if (userProfile) {
                   supabase.auth.updateUser({
                     data: {
                       bio: userProfile.bio,
                       hobbies: userProfile.hobbies,
                       location: userProfile.location
                     }
                   }).catch(err => console.error(err));
                 }
             }} className="w-full py-5 bg-gradient-to-r from-deep-rose to-primary-pink text-off-white rounded-full font-bold uppercase tracking-widest text-[11px] shadow-[0_15px_30px_-10px_rgba(158,58,68,0.5)] transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Save & Return
             </button>
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
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            </button>
         </form>
      </div>
    );
  }

  const currentProfile = allProfiles[currentIndex];
  
  return (
    <div className="min-h-screen bg-soft-blush flex flex-col pt-24 md:pt-32 pb-12 px-4 relative">
      
      {/* Small Header specifically for dashboard */}
      <div className={`fixed top-0 left-0 w-full px-4 md:px-8 flex justify-between items-center z-[60] transition-all duration-500 ${scrolled ? "py-4 bg-off-white/90 backdrop-blur-md shadow-sm border-b border-deep-rose/10" : "py-6 bg-transparent"}`}>
        <div className="font-serif text-deep-rose italic tracking-widest text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentPage('home')}>
          Aphrodite
        </div>
        
        <div className="hidden md:flex bg-white/50 backdrop-blur-md rounded-full px-6 h-10 border border-deep-rose/10 gap-6 items-center justify-center shadow-sm">
            <button onClick={() => setView('swipe')} className={`font-sans flex items-center h-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 ${view === 'swipe' ? 'text-deep-rose' : 'text-neutral-dark/60 hover:text-deep-rose'}`}>Explore</button>
            <button onClick={() => setView('matches')} className={`font-sans flex items-center h-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 ${view === 'matches' ? 'text-deep-rose' : 'text-neutral-dark/60 hover:text-deep-rose'}`}>Matches</button>
            <button onClick={() => setView('chat')} className={`font-sans flex items-center h-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 ${view === 'chat' ? 'text-deep-rose' : 'text-neutral-dark/60 hover:text-deep-rose'}`}>Chat</button>
            <button onClick={() => setView('stats')} className={`font-sans flex items-center h-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:scale-105 ${view === 'stats' ? 'text-deep-rose' : 'text-neutral-dark/60 hover:text-deep-rose'}`}>Stats</button>
        </div>

        <div className="flex gap-4 items-center">
          <div onClick={() => setView('profile')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-deep-rose/20 overflow-hidden cursor-pointer hover:border-deep-rose transition-colors relative group bg-soft-blush flex items-center justify-center">
            {userProfile?.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Me" className="w-full h-full object-cover mix-blend-multiply group-hover:opacity-80 transition-opacity" />
            ) : (
              <span className="text-deep-rose font-bold text-[10px] md:text-xs uppercase">Me</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-[400px] mx-auto">
        
        {/* Match / Flames Pop-up Modal */}
        {matchData && view === 'swipe' && (
          <div className="fixed inset-0 bg-off-white/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-soft-blush w-full max-w-md rounded-[40px] p-8 md:p-12 text-center shadow-2xl border border-deep-rose/20 flex flex-col items-center relative overflow-hidden">
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-deep-rose/10 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-pink/10 rounded-full blur-3xl pointer-events-none"></div>

               <h2 className="font-serif text-5xl md:text-6xl text-deep-rose mb-2 font-bold rotate-[-2deg]">{matchData.outcome.word}</h2>
               <h3 className="font-sans text-xs uppercase tracking-[0.3em] font-bold text-neutral-dark/60 mb-6">{matchData.score}% COMPATIBILITY</h3>

               <div className="flex items-center gap-6 mb-8 relative z-10">
                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-off-white shadow-xl overflow-hidden">
                    <img src={userProfile?.avatarUrl || "/avatar1.png"} alt="You" className="w-full h-full object-cover mix-blend-multiply bg-soft-blush" />
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

        {/* Swipe View */}
        {view === 'swipe' && (
          <>
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
          </>
        )}

        {/* Empty States for non-swipe views */}
        {view === 'matches' && (
          <div className="text-center font-sans tracking-widest text-neutral-dark/60 uppercase text-xs font-bold animate-fade-in">
             <div className="w-16 h-16 mx-auto bg-deep-rose/10 rounded-full flex items-center justify-center mb-4">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-deep-rose"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
             </div>
             No matches pending. Keep exploring!
          </div>
        )}

        {view === 'stats' && (
          <div className="text-center font-sans tracking-widest text-neutral-dark/60 uppercase text-xs font-bold animate-fade-in">
             <div className="w-16 h-16 mx-auto bg-deep-rose/10 rounded-full flex items-center justify-center mb-4">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-deep-rose"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m12-8v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2z"/></svg>
             </div>
             Stats calculating based on your activity...
          </div>
        )}

        {view === 'chat' && !chatPartner && (
          <div className="text-center font-sans tracking-widest text-neutral-dark/60 uppercase text-xs font-bold animate-fade-in">
             <div className="w-16 h-16 mx-auto bg-deep-rose/10 rounded-full flex items-center justify-center mb-4">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-deep-rose"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
             </div>
             No active chats right now.
          </div>
        )}

      </div>
    </div>
  );
}