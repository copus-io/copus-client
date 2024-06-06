import { memo, useEffect, useState } from 'react';
import ModalPro from 'src/components/ModalPro';
import styles from './index.module.less';
import StreamWater from './StreamWater';
import { OpusInfo } from 'src/data/use-work-detail';
import Success from './Success';

interface StreamCreatorModalProps {
  open: boolean;
  onCancel: () => void;
  opusInfo?: OpusInfo;
}

const StreamCreatorModal = (props: StreamCreatorModalProps) => {
  const { open, onCancel, opusInfo } = props;
  const [streamSuccess, setStreamSuccess] = useState(false); // 打赏成功
  const [amount, setAmount] = useState(0); // 赏金
  /** recoil */
  const onSuccess = (amount?: string) => {
    setStreamSuccess(true);
    setAmount(Number(amount));
  };
  useEffect(() => {
    console.log('streamSuccess');
  }, [streamSuccess]);
  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        centered
        width={streamSuccess ? 440 : 490}
        destroyOnClose={true}
        onCancel={onCancel}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
        afterClose={() => {
          setStreamSuccess(false);
        }}
      >
        {streamSuccess ? (
          <Success data={{ type: 1, amount }} opusInfo={opusInfo}></Success>
        ) : (
          <StreamWater
            opusInfo={opusInfo}
            onCancel={onCancel}
            onStreamSuccess={onSuccess}
          ></StreamWater>
        )}
      </ModalPro>
    </div>
  );
};
export default memo(StreamCreatorModal);
