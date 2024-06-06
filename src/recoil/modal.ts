import { atom } from 'recoil';

// modal
export const modal = atom({
  key: 'modalSave',
  default: {
    isSave: false,
  },
});
