import { atom } from 'recoil';

// casland
export const caslandIsShow = atom({
  key: 'caslandIsShow',
  default: {
    isShow: false,
    tileNum: '',
  },
});
