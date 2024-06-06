import { ReactNode, useEffect, useState } from 'react';
import LoginModel from '../Login';
import Menu from '../Menu';
import styles from './index.module.less';

const Layout = ({ children }: { children: ReactNode }) => {
  const [family, setFamily] = useState('');
  const lang = localStorage.getItem('lang') || 'en';
  useEffect(() => {
    if (lang === 'en') {
      setFamily('Maven Pro');
    } else {
      setFamily('Noto Sans SC');
    }
  }, [lang]);
  const [Login, setLogin] = useState<boolean>(false);
  const handelClick = (type: boolean) => {
    setLogin(type);
  };

  return (
    <div
      className="h-full flex select-none"
      style={{
        fontFamily: family,
      }}
    >
      <div className="flex  w-full  overflow-hidden relative">
        <div className={styles.menu}>
          <Menu handelClick={handelClick} />
        </div>
        <div className="flex-1 w-full overflow-hidden  ">
          <div className="h-full overflow-x-auto overflow-y-hidden mx-[auto] ">
            {children}
          </div>
        </div>
      </div>
      <LoginModel open={Login} handleCancelCallback={handelClick}></LoginModel>
    </div>
  );
};
export default Layout;
