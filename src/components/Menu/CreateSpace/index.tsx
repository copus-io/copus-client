import { memo } from 'react';
import ModalPro from 'src/components/ModalPro';
import CreateSpace from 'src/pc/CreateSpace';
import styles from './index.module.less';
interface AddLinkModalProps {
  open: boolean;
  handleCancelCallback: () => void;
}
const PersonSettingModal = (props: AddLinkModalProps) => {
  const { open, handleCancelCallback } = props;

  // 获取屏幕高度
  /** 关闭 */
  const onCancel = async () => {
    handleCancelCallback();
  };
  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        width={900}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
      >
        <CreateSpace close={handleCancelCallback}></CreateSpace>
      </ModalPro>
    </div>
  );
};
export default memo(PersonSettingModal);
