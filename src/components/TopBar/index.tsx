import { ReactComponent as CreatorCenterIcon } from 'src/assets/media/svg2/ic-cc.svg';
import { ReactComponent as LogoIcon } from 'src/assets/media/svg2/ic-copus.svg';
import { ReactComponent as NotificationIcon } from 'src/assets/media/svg2/icon-notification1.svg';

import { Badge } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Login from 'src/components/Login';
import { CommonModal } from 'src/components/ModalPro';
import UserAvatar from 'src/components/UserAvatar';
import { userUnreadMsgCount } from 'src/data/use-user-info';
import useUserInfo from 'src/hooks/use-user-info';
import NotificationView from 'src/pc/modalViews/NotificationView';
import UserSetting from 'src/pc/modalViews/UserSetting';
import { subscribe } from 'src/utils/event';

const TopBar = ({
  showBack = true,
  type = 0,
}: {
  showBack?: boolean;
  type?: number;
}) => {
  const { data: userInfo } = useUserInfo();
  const { t, i18n } = useTranslation();

  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
  const [openPersonSetting, setOpenPersonSetting] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const handleCancelCallback = () => {
    setOpenPersonSetting(false);
    setOpenNotificationModal(false);
    setOpenLoginModal(false);
  };

  const [unreadMsgCount, setUnReadMsgCount] = useState(0);
  const [freshMsgCount, setFreshMsgCount] = useState(0);
  useEffect(() => {
    subscribe('freshMsgCount', () => {
      setFreshMsgCount(freshMsgCount + 1);
    });

    subscribe('showLoginView', () => {
      setOpenLoginModal(true);
    });
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    userUnreadMsgCount().then((resp) => {
      setUnReadMsgCount(resp);
    });
  }, [freshMsgCount]);

  useEffect(() => {
    let lang = 'en';
    if (userInfo && userInfo.languageType === 10) {
      lang = 'zh';
    }
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
  }, [i18n, userInfo]);

  return (
    <div>
      <div
        className={clsx(
          'top-bar h-[63px] border-[#e0e0e0] flex justify-between items-center',
          showBack && '!border-b-[1px]'
        )}
      >
        {showBack && (
          <Link className="ml-[35px]" href={'/'}>
            <LogoIcon />
          </Link>
        )}
        {btnListOnLoginState()}
      </div>

      <CommonModal
        open={openPersonSetting}
        handleCancelCallback={handleCancelCallback}
        title={t('clientUI.personal.name')}
      >
        <UserSetting />
      </CommonModal>

      {openNotificationModal && (
        <CommonModal handleCancelCallback={handleCancelCallback}>
          <NotificationView />
        </CommonModal>
      )}

      <Login
        open={openLoginModal}
        handleCancelCallback={handleCancelCallback}
      ></Login>
    </div>
  );

  function btnListOnLoginState() {
    if (userInfo) {
      return (
        <div className="flex">
          <div
            onClick={() => {
              setOpenNotificationModal(true);
            }}
            className="flex justify-center items-center cursor-pointer"
          >
            <NotificationIcon />
            <Badge
              count={unreadMsgCount}
              color="secondary"
              offset={[-4, -20]}
            ></Badge>
          </div>

          <Link
            href={`/creatorCenter`}
            className="mx-[10px] flex justify-center items-center"
          >
            <CreatorCenterIcon />
          </Link>

          <div className="flex justify-center items-center cursor-pointer mr-[10px] ">
            <Link href={`/user/${userInfo.namespace}?type=0`}>
              <UserAvatar logoUrl={userInfo?.faceUrl} size={32} />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => {
          setOpenLoginModal(true);
        }}
        className="rounded-full text-[16px] font-[500] bg-[#484848] text-[#fff] flex items-center gap-[6px]  px-[20px] py-[10px] mr-[30px] cursor-pointer"
      >
        {t('clientUI.login.btnName')}
      </div>
    );
  }
};
export default TopBar;
