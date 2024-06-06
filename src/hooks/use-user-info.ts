import { useContext } from 'react';
import UserInfoContext from 'src/context/user-info-context';

const useUserInfo = () => useContext(UserInfoContext);

export default useUserInfo;
