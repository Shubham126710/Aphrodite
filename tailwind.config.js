export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-pink": "#E85D75",
        "soft-blush": "#FBE4E6",
        "light-rose": "#F6D2D6",
        "deep-rose": "#9E3A44",
        "neutral-dark": "#2B2B2B",
        "off-white": "#FFF7F8"
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'floating-bubble': 'floatingBubble 12s ease-in-out infinite',
        'floating-bubble-delayed': 'floatingBubble 12s ease-in-out -6s infinite',
        'floating-bubble-slow': 'floatingBubble 18s ease-in-out -4s infinite',
        'drift-up': 'driftVertical 20s linear infinite',
        'drift-up-delayed': 'driftVertical 20s linear -10s infinite',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        floatingBubble: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-10px)' },
        },
        driftVertical: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '10%': { opacity: '0.4' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-800px)', opacity: '0' },
        },
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
