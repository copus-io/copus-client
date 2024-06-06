import { memo, useCallback, useEffect, useState } from 'react';
import { Web3ContextProvider } from 'react-dapp-web3';
import ModalPro from 'src/components/ModalPro';
import Forget from 'src/pc/Forget';
import Login from 'src/pc/Login';
import Signup from 'src/pc/Signup';
import { subscribe } from 'src/utils/event';
import styles from './index.module.less';

interface IProps {
  open: boolean;
  spaceMutate?: () => void;
  handleCancelCallback: (type: boolean) => void;
}
const providersConfig = {
  walletConnectV2: {
    projectId: '8a02973eb157922f76721624650089f0',
    chainIds: [1],
  },
};
const LoginModal = (props: IProps) => {
  const { open, handleCancelCallback } = props;
  // 步骤
  const [step, setStep] = useState<number>(0);

  /** 关闭 */
  const onCancel = async () => {
    handleCancelCallback(false);
    setStep(0);
  };

  useEffect(() => {
    subscribe('Sign_CodeSuccess', () => {
      onCancel();
    });
  });

  // 设置步骤
  const handelSetStep = useCallback((step: number) => {
    setStep(step);
  }, []);
  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        width={640}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
      >
        {step === 0 && (
          <Web3ContextProvider config={providersConfig}>
            <Login
              handelCancel={onCancel}
              handelSetStep={handelSetStep}
            ></Login>
          </Web3ContextProvider>
        )}
        {step === 1 && <Signup handelSetStep={handelSetStep}></Signup>}
        {step === 2 && <Forget handelSetStep={handelSetStep}></Forget>}
      </ModalPro>
    </div>
  );
};
export default memo(LoginModal);
