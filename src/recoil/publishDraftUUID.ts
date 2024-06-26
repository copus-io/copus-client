import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
export const publishDraftUUID = atom({
  key: 'draftUUID',
  default: '',
  effects_UNSTABLE: [persistAtom],
});
