import { logoutReq } from 'src/api/user';
import { ReactComponent as SmallWaterIcon } from 'src/assets/media/svg/icon-small-water.svg';
import { ReactComponent as LogoutOutIcon } from 'src/assets/media/svg2/icon-more.svg';
import { ReactComponent as SignOutIcon } from 'src/assets/media/svg2/icon-sign-out.svg';

import { message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserAvatar from 'src/components/UserAvatar';
import { floorFixedNumber } from 'src/utils/common';
import { TOKEN } from 'src/utils/statics';

interface IProp {
  userInfo: any;
  onLogout: () => void;
}
const User = (IProp: IProp) => {
  const { userInfo, onLogout } = IProp;
  const router = useRouter();
  const { t } = useTranslation();
  const [isShowLogout, setIsShowLogout] = useState(false);

  const logout = async () => {
    try {
      setIsShowLogout(false);
      const res = await logoutReq();

      if (res.data.data) {
        message.success(t('clientUI.personal.logout.logoutTips'));
        localStorage.removeItem(TOKEN);
        onLogout();
        router.push('/');
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  return (
    <div
      className="h-[76px] relative px-[20px] py-[10px] mt-[20px] flex items-center justify-between"
      onClick={(e) => {
        e.preventDefault();
        setIsShowLogout(false);
      }}
    >
      <div className="flex items-center">
        <Link href={`/user/${userInfo.namespace}?type=0`}>
          <UserAvatar
            isSeedao={userInfo?.seedaoAlias ? true : false}
            logoUrl={userInfo?.faceUrl}
          />
        </Link>
        <div className="ml-[15px]">
          <div className="leading-5">{userInfo?.username || '----'}</div>
          <div className="flex items-center mt-1">
            <SmallWaterIcon />
            <span className="ml-1 text-[14px] leading-[18px]">
              {floorFixedNumber(userInfo?.tokenAmount || 0, 0)}
            </span>
          </div>
        </div>
      </div>

      <div
        className="logout cursor-pointer absolute right-[20px] top-[38px]"
        onClick={(e) => {
          setIsShowLogout(!isShowLogout);
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <LogoutOutIcon />
      </div>

      {isShowLogout && (
        <div
          className="absolute top-[60px] w-[160px] bg-[#fff] h-[42px] py-[12px] px-[20px] flex justify-between items-center rounded-[10px] text-[16px] text-[#231f20] cursor-pointer hover:bg-[#f5f3f3]"
          style={{
            boxShadow: '1px 1px 10px 0 rgba(118, 118, 118, 0.4)',
          }}
          onClick={logout}
          onMouseLeave={() => setIsShowLogout(!isShowLogout)}
        >
          {t('clientUI.logout')}
          <SignOutIcon />
        </div>
      )}
    </div>
  );
};
export default User;
