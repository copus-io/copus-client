import { createContext } from 'react';
import { UserInfo } from 'src/api/user';
import type { KeyedMutator } from 'swr';

const UserInfoContext = createContext<{
  isValidating: boolean;
  mutate: KeyedMutator<UserInfo>;
  data?: UserInfo;
}>(null!);

export default UserInfoContext;
