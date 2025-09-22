/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00ffff',
        'cyber-pink': '#ff00ff',
        'cyber-green': '#00ff00',
        'cyber-purple': '#8a2be2',
        'cyber-dark': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
        'neon-yellow': '#ffff00'
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono': ['Fira Code', 'monospace']
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite linear'
      },
      keyframes: {
        glow: {
          '0%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
          '100%': { 
            textShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
          }
        },
        'pulse-neon': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '50%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          }
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '1'
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4'
          }
        }
      }
    },
  },
  plugins: [],
}
