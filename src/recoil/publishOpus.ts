import { atom } from 'recoil';

// drawerOpen
export const publishAtom = atom({
  key: 'publish',
  default: false,
});

export const autoSaveStateAtom = atom({
  key: 'autoSaveState',
  default: 0,
});
