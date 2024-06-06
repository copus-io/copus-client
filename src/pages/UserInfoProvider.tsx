import { FC, ReactNode, useEffect, useState } from 'react';
import UserInfoContext from 'src/context/user-info-context';
import useUserInfoReq from 'src/data/use-user-info';
import { TOKEN } from 'src/utils/statics';

interface UserInfoProviderProps {
  children: ReactNode;
}

const UserInfoProvider: FC<UserInfoProviderProps> = (props) => {
  const { children } = props;
  const { data: userinfo, isValidating, mutate } = useUserInfoReq();
  const [providerValue, setProviderValue] = useState({
    data: userinfo,
    isValidating,
    mutate,
  });

  useEffect(() => {
    // console.log('userinfo  -------------', userinfo);
    if (userinfo && localStorage.getItem(TOKEN)) {
      userinfo.seedaoAlias = false;
      // userinfo.seedaoAlias = false;
      if (!userinfo.seeDaoName) {
        // if (userinfo.walletAddress) {
        //   sns.name(userinfo.walletAddress).then(async (value: string) => {
        //     if (localStorage.getItem(TOKEN)) {
        //       let res = await updateExtendInfo({ type: 0, value: value });
        //       if (res.data.data) {
        //         userinfo.seedaoAlias = value.length > 0;
        //         setProviderValue({
        //           data: userinfo,
        //           isValidating,
        //           mutate,
        //         });
        //       }
        //     }
        //   });
        // }
      } else {
        userinfo.seedaoAlias = true;
      }
    }
    setProviderValue({
      data: userinfo,
      isValidating,
      mutate,
    });
    // console.log('providerValue  -------------  end', providerValue);

    // return { data, isValidating, mutate };
  }, [userinfo, isValidating, mutate]);

  // const providerValue = useMemo(() => {
  //   console.log('providerValue  -------------', data);

  //   if (data?.walletAddress) {
  //     sns.name(data?.walletAddress).then((value: string) => {
  //       console.log('12312', value);
  //       if (value.length > 0) {
  //         data.seedaoAlias = true;
  //       }
  //     });
  //     // data.seedaoAlias = data.walletAddress;
  //   }
  //   return { data, isValidating, mutate };
  // }, [data, isValidating, mutate]);

  return (
    <UserInfoContext.Provider value={providerValue}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
