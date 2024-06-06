import { createContext } from 'react';
import { SpaceDetailInfo } from 'src/data/use-space-detail';
import type { KeyedMutator } from 'swr';

const SpaceInfoContext = createContext<{
  spaceDetail?: SpaceDetailInfo;
  spaceMutate: KeyedMutator<SpaceDetailInfo>;
}>(null!);

export default SpaceInfoContext;
