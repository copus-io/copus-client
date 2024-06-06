import { atom } from 'recoil';

// theme
export const themeObj = atom({
  key: 'theme',
  default: {
    default: true,
    theme: 'light',
    bgImageUrl: '',
    color: '',
    opacity: 80,
  },
});
