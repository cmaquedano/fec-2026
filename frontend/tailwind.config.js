/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#020308',
        surface: '#05070F',
        panel: '#0B0F19',
        cyan: {
          DEFAULT: '#00F0FF',
        },
        blueTech: '#0077FF',
        alert: '#FF5500',
        danger: '#FF0055',
        metal: '#E2E8F0',
        tech: '#64748B',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Share Tech Mono"', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 8px rgba(0,240,255,0.55), 0 0 24px rgba(0,240,255,0.25)',
        neonBlue: '0 0 8px rgba(0,119,255,0.55), 0 0 24px rgba(0,119,255,0.25)',
        neonAlert: '0 0 8px rgba(255,85,0,0.55), 0 0 24px rgba(255,85,0,0.25)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        flicker: {
          '0%, 96%, 100%': { opacity: '1' },
          '97%': { opacity: '0.6' },
          '98%': { opacity: '1' },
        },
      },
      animation: {
        scan: 'scan 5s linear infinite',
        blink: 'blink 1s step-start infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
        flicker: 'flicker 6s linear infinite',
      },
    },
  },
  plugins: [],
};
