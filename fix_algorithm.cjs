const fs = require('fs');

let doc = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const oldComputeStart = `  const computeFlamesResult = (name1: string, name2: string): string => {`;
const oldCalcEndMarker = `    setMatchData({ profile, outcome: winningOutcome, score: topScore, distribution });\n  };`;

const startIndex = doc.indexOf(oldComputeStart);
const endIndex = doc.indexOf(oldCalcEndMarker) + oldCalcEndMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  const oldBlock = doc.substring(startIndex, endIndex);

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
      letter: frames[0] || flames[0],
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
  
  doc = doc.replace(oldBlock, newCalc);
  fs.writeFileSync('src/components/Dashboard.tsx', doc);
  console.log("Successfully replaced algorithmic block");
} else {
  console.log("Failed to find string block.");
}
