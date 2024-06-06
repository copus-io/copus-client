import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

/**
 * modal组件二次封装改默认样式
 */
const ModalPro = (props: ModalProps) => {
  /** hook */
  const { t, i18n } = useTranslation();
  const [family, setFamily] = useState('');
  const lang = i18n.language;
  // /** 存储数据 */
  useEffect(() => {
    if (lang === 'en') {
      setFamily('Maven Pro ');
    } else {
      setFamily('Noto Sans SC');
    }
  }, [lang]);

  const { className, ...rest } = props;
  return (
    <Modal
      getContainer=".cascade_con"
      style={{
        fontFamily: family,
      }}
      className={clsx(styles.modal, className)}
      maskClosable={false}
      keyboard={false}
      {...rest}
    />
  );
};

export default ModalPro;

interface CommonModalProps {
  open?: boolean;
  handleCancelCallback: () => void;
  title?: string;
  width?: number;
  children: ReactNode;
}

export const CommonModal = (props: CommonModalProps) => {
  let { open, title, handleCancelCallback, children, width = 900 } = props;

  const onCancel = async () => {
    handleCancelCallback();
  };

  if (open === undefined) {
    open = true;
  }

  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        width={width}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
      >
        {title ? (
          <div className="text-first text-[25px] pt-[60px] mb-[30px] pl-[30px] font-[500] h-[38px]">
            {title}
          </div>
        ) : (
          <div className="pt-[40px]"></div>
        )}
        {children}
      </ModalPro>
    </div>
  );
};
