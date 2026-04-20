const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

if (!content.includes('const [scrolled, setScrolled]')) {
  content = content.replace('const [tourStep, setTourStep] = useState<number>(userProfile?.hasCompletedTour ? 15 : 0);', `const [tourStep, setTourStep] = useState<number>(userProfile?.hasCompletedTour ? 15 : 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`);
}

content = content.replace(
  '<div className="absolute top-6 w-full left-0 px-4 md:px-8 flex justify-between items-center z-[60]">',
  '<div className={`fixed top-0 left-0 w-full px-4 md:px-8 flex justify-between items-center z-[60] transition-all duration-500 ${scrolled ? "py-4 bg-off-white/90 backdrop-blur-md shadow-sm border-b border-deep-rose/10" : "py-6 bg-transparent"}`}>'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
