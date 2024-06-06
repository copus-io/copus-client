import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import CodeSucces from './CodeSucces';
import EnterCode from './EnterCode';
import InputEmail from './InputEmail';
interface ISignUpType {
  handelSetStep: (value: number) => void;
}
const SignUpPage = (props: ISignUpType) => {
  const router = useRouter();
  const { handelSetStep } = props;
  const CBUrl = router.query.cburl as string;
  // 设置当前步骤
  const [step, setStep] = useState(1);
  const [signupProps, setSignupProps] = useState({});

  /** 修改步骤 */
  const changeStep = useCallback((step: number, props?: any) => {
    setSignupProps(props);
    setStep(step);
  }, []);

  return (
    <div className="h-full overflow-y-auto flex  justify-center ">
      <div className="h-full min-h-[700px] w-[400px] mx-[auto] flex justify-center flex-col py-[64px]">
        <div className={`${step === 1 ? '' : 'h-0 overflow-hidden'}`}>
          <InputEmail changeStep={changeStep} />
        </div>
        {step === 2 && <EnterCode {...signupProps} />}
        {step === 3 && <CodeSucces changeStep={changeStep} CBUrl={CBUrl} />}
      </div>
    </div>
  );
};
export default SignUpPage;
