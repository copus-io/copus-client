import { useTranslation } from 'react-i18next';
import TopBar from '../TopBar';
import styles from './index.module.less';

export default function Loading() {
  const { t } = useTranslation();
  return (
    <div className={styles.divBg}>
      <TopBar />
      <div className="h-[90vh] flex flex-col items-center justify-center font-[500] text-[25px]">
        {t('clientUI.loading')}
      </div>
    </div>
  );
}
