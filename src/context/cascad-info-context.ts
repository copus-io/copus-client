import { createContext } from 'react';
import { SpaceDetailInfo } from 'src/data/use-space-detail';
import type { KeyedMutator } from 'swr';

const CascadInfoContext = createContext<{
  cascadDetail?: SpaceDetailInfo;
  cascaMutate: KeyedMutator<SpaceDetailInfo>;
}>(null!);

export default CascadInfoContext;
