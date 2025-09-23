import type { Config } from 'tailwindcss';
const sharedConfig = require('../../tailwind.config.preset');

const config: Config = {
  presets: [sharedConfig],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
    },
  },
};

export default config;
