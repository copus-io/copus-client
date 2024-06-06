import User from 'src/components/User';
import useUserInfo from 'src/hooks/use-user-info';
import CreateOpusModal from './CreateOpusModal';
import CreateSpace from './CreateSpace';
import Item from './Item';

import router from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Links from './Links';
import Space from './Space';
interface IProps {
  handelClick: (type: boolean) => void;
}
const Menu = (props: IProps) => {
  const { t, i18n } = useTranslation();
  const { data: userInfo, mutate: mutateUserInfo } = useUserInfo();
  const { handelClick } = props;
  const onLogout = () => {
    mutateUserInfo();
  };
  useEffect(() => {
    let lang = 'en';
    if (userInfo && userInfo.languageType === 10) {
      lang = 'zh';
    }
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
  }, [i18n, userInfo]);
  // 弹框
  const [openSetting, setOpenSetting] = useState(false);
  const [openOpusModal, setOpenOpusModal] = useState(false);

  const handleCancelCallback = () => {
    setOpenSetting(false);
    setOpenOpusModal(false);
  };

  const handelCreate = (tag: number) => {
    if (tag === 1) {
      router.push(`/create?cburl=${router.asPath}`);
    } else setOpenSetting(true);
  };

  return (
    <div className="h-full">
      {userInfo ? (
        <div className="h-full flex flex-col justify-between">
          <User userInfo={userInfo} onLogout={onLogout}></User>
          <Item handelCreate={handelCreate}></Item>
          <Space></Space>
          <Links></Links>
        </div>
      ) : (
        <div className="h-[100vh] flex flex-col justify-between">
          <div className="border-b-[1px] border-[#e0e0e0] px-[30px] py-[80px] mt-[20px]">
            <div
              className="rounded-full cursor-pointer bg-[#484848] text-[#fff] flex justify-center text-[16px] font-[500] px-[10px] py-[8px]"
              onClick={() => handelClick(true)}
            >
              {t('clientUI.login.btnName')}
            </div>
          </div>
          <Links></Links>
        </div>
      )}
      <CreateSpace
        open={openSetting}
        handleCancelCallback={handleCancelCallback}
      ></CreateSpace>
      <CreateOpusModal
        open={openOpusModal}
        handleCancelCallback={handleCancelCallback}
      ></CreateOpusModal>
    </div>
  );
};
export default Menu;
