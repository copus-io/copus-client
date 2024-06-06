import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import TopBar from 'src/components/TopBar';
import styles from './index.module.less';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.divBg}>
      <TopBar />
      <div className="h-[90vh] flex flex-col items-center justify-center font-[500] text-[25px]">
        <span>{t('clientUI.page404.title')}</span>
        <Link href={'/'}>
          <div className="bg-[#484848] rounded-full px-[20px] py-[10px] text-[#fff] mt-[50px]  text-[16px]">
            {t('clientUI.page404.btnName')}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page404;
