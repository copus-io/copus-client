import { atom } from 'recoil';
import { UpstreamOpus } from 'src/api/createOpus';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();
// casland
export const upstreamAtom = atom<UpstreamOpus | null>({
  key: 'upstream',
  default: null,
  effects_UNSTABLE: [persistAtom],
});
