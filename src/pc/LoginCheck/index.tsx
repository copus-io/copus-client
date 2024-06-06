import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Login from 'src/components/Login';
import TopBar from 'src/components/TopBar';
import useUserInfo from 'src/hooks/use-user-info';
import styles from './index.module.less';

export default function LoginCheck({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { data: localUserInfo, isValidating } = useUserInfo();
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  return getView();

  function getView() {
    if (!localUserInfo && !isValidating)
      return tipsPage(
        <div className="text-center font-[500] text-[25px] leading-6 flex flex-col gap-[10px]">
          <div>Please log in to check your access.</div>
        </div>
      );
    return <>{children}</>;
  }

  function tipsPage(tips: React.ReactNode) {
    return (
      <div className={styles.divBg}>
        <TopBar />
        <div className="h-[90vh] flex flex-col items-center justify-center font-[500] text-[25px]">
          {tips}
          <div
            onClick={() => {
              setOpenLoginModal(true);
            }}
            className="rounded-full text-[16px] font-[500] bg-[#484848] text-[#fff] flex items-center gap-[6px]  px-[20px] py-[10px] mr-[30px] cursor-pointer mt-[30px]"
          >
            {t('clientUI.login.btnName')}
          </div>
        </div>

        <Login
          open={openLoginModal}
          handleCancelCallback={() => {
            setOpenLoginModal(false);
          }}
        ></Login>
      </div>
    );
  }
}
