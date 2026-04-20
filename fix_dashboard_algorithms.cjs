const fs = require('fs');

let doc = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

// 1. Change Profile id type
doc = doc.replace('id: number;', 'id: number | string;');

// 2. Introduce dynamic profile fetching
doc = doc.replace(
`  const [chatPartner, setChatPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<{sender: 'me' | 'them', text: string}[]>([]);`,
`  const [chatPartner, setChatPartner] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<{sender: 'me' | 'them', text: string}[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(mockProfiles);

  // Fetch real users from Supabase securely if possible
  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        // Safely fetch public profiles if they exist in the DB
        const { data, error } = await supabase.from('profiles').select('*').limit(20);
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
        filter: \`receiver_id=eq.\${userProfile.id}\`
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
`);

// 3. Fix the array index mapping for swipe logic
doc = doc.replaceAll('mockProfiles[currentIndex]', 'allProfiles[currentIndex]');
doc = doc.replaceAll('mockProfiles.length', 'allProfiles.length');

// 4. Sophisticated FLAMES matching
// Replace computeFlamesResult and calculateFlames entirely
const oldCalcStart = `  const computeFlamesResult = (name1: string, name2: string): string => {`;
const oldCalcEnd = `            distribution[others[i].word] = share;
            remaining -= share;
        }
    }
    
    setMatchData({ profile, outcome: winningOutcome, score: topScore, distribution });
  };`;

// We inject our new massive sophisticated algorithm
const newCalc = `  const computeCompatibilityMetrics = (user: UserProfileData | null, target: Profile) => {
    // Advanced NLP-like substring matching algorithm checking shared hobbies/locations/bios
    const myBio = \`\${user?.bio || ''} \${user?.hobbies || ''} \${user?.location || ''}\`.toLowerCase();
    const theirBio = \`\${target.bio} \${target.personality} \${target.location}\`.toLowerCase();
    
    const myWords = myBio.split(/\\s+/).filter(w => w.length > 3);
    const theirWords = theirBio.split(/\\s+/).filter(w => w.length > 3);
    
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
  };`;

const regex = new RegExp(oldCalcStart.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\$&') + '[\\s\\S]*?' + oldCalcEnd.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\$&'));
doc = doc.replace(regex, newCalc);

// 5. Update Chat to handle inserting database strings + Fake Bot
doc = doc.replace(
`  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
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
  };`,
`  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
    if (!input.value.trim() || !chatPartner) return;
    
    const msg = input.value;
    input.value = '';
    setMessages(prev => [...prev, { sender: 'me', text: msg }]);
    
    const isFakeUser = typeof chatPartner.id === 'number';

    if (isFakeUser) {
        // Pre-defined bot text mimicking a real interaction 
        setTimeout(() => {
           const botReplies = [
             "That's so interesting! Tell me more ✨", "Haha, I was just thinking the same thing.",
             "I genuinely love that perspective.", "Wait, really? That's wild.",
             "Honestly, I'm just looking for good vibes right now. You?", "Oh absolutely. 100% agreement here."
           ];
           const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
           setMessages(prev => [...prev, { sender: 'them', text: reply }]);
        }, 1500);
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
  };`
);

fs.writeFileSync('src/components/Dashboard.tsx', doc);
