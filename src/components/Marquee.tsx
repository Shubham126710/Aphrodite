export default function Marquee() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-deep-rose text-off-white py-4 border-t-[1.5px] border-neutral-dark/10 z-30 block">
      <div 
        className="flex whitespace-nowrap font-sans text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-bold w-max animate-ticker"
        style={{ willChange: 'transform' }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="px-4 md:px-8 flex items-center shrink-0">
            <span className="text-primary-pink mr-4 md:mr-8 text-lg">♥</span> AUTHENTIC CONNECTION 
            <span className="text-primary-pink mx-4 md:mx-8 text-lg">♥</span> NO MINDLESS SWIPING 
            <span className="text-primary-pink mx-4 md:mx-8 text-lg">♥</span> CURATED EVENTS 
            <span className="text-primary-pink mx-4 md:mx-8 text-lg">♥</span> ROMANCE IS BACK
          </span>
        ))}
      </div>
    </div>
  );
}
