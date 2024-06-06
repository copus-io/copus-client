import { message, Spin } from 'antd';
import router from 'next/router';
import { useTranslation } from 'react-i18next';
import { thirdLogin } from 'src/api/user';
import useUserInfo from 'src/hooks/use-user-info';
import { TOKEN } from 'src/utils/statics';
import styles from './index.module.less';
const Callback = () => {
  const CBUrl = window.location.search;
  const cburl = sessionStorage.getItem('cburl');
  const { mutate: mutateUserInfo } = useUserInfo();
  const { t } = useTranslation();
  const login = async () => {
    try {
      const res = await thirdLogin({ url: CBUrl });
      if (res.data.status === 1) {
        message.success('Success!');
        localStorage.setItem(TOKEN, res.data.data);
        mutateUserInfo();
        if (cburl) {
          router.push(cburl);
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      //   message.error((error as Error).message);
    }
  };
  login();
  return (
    <div>
      <div className={styles.mask}>
        <Spin tip={t('clientUI.login.authLogin')}></Spin>
      </div>
    </div>
  );
};
export default Callback;
