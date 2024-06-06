import { memo } from 'react';
import ModalPro from 'src/components/ModalPro';
import CreateOpus from 'src/pc/CreateOpus';
import styles from './index.module.less';
interface CreateOpusProps {
  open: boolean;
  spaceNamespace?: string;
  handleCancelCallback: () => void;
}
const CreateOpusModal = (props: CreateOpusProps) => {
  const { open, handleCancelCallback, spaceNamespace } = props;

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
        width={900}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
      >
        <CreateOpus
          close={handleCancelCallback}
          spaceId={spaceNamespace}
        ></CreateOpus>
      </ModalPro>
    </div>
  );
};
export default memo(CreateOpusModal);
