import { memo } from 'react';
import ModalPro from 'src/components/ModalPro';
import Publish from '../Publish';
import styles from './index.module.less';

interface PublishModalProps {
  open: boolean;
  isFromBranch: boolean;
  spaceId?: string;
  handleCancelCallback: () => void;
}
const PublishModal = (props: PublishModalProps) => {
  const { open, handleCancelCallback, spaceId, isFromBranch } = props;
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
        centered
        width={1364}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
      >
        <Publish spaceId={spaceId} isFromBranch={isFromBranch}></Publish>
      </ModalPro>
    </div>
  );
};
export default memo(PublishModal);
