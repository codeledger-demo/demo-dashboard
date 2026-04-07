import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0b6e4f',
          secondary: '#1a3a2a',
          accent: '#3d9970',
        },
        semantic: {
          success: '#0b6e4f',
          warning: '#bc6c25',
          error: '#a23b2a',
          info: '#2563eb',
        },
        surface: {
          bg: '#fafaf9',
          card: '#ffffff',
          elevated: '#f5f5f4',
          sidebar: '#1a3a2a',
        },
      },
      fontFamily: {
        serif: ['Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
