import { message } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVerificationCodeReq, registerReq } from 'src/api/user';
import useUserInfo from 'src/hooks/use-user-info';
import { TOKEN } from 'src/utils/statics';
import CodeBox from './CodeBox';
import styles from './index.module.less';

const EnterCode = (props: any) => {
  const { email, username, password, walletAddress, changeStep } = props;
  const [validatedCode, setValidatedCode] = useState(true);
  const { t } = useTranslation();

  const { mutate: mutateUserInfo } = useUserInfo();
  const [commitLoading, setCommitLoading] = useState(false);
  const [sendCode, setSendCode] = useState(false);

  const [code, setCode] = useState('');
  // 输入 验证码
  const onChange = (val: any) => {
    // console.log('val:', val);
    setCode('');
  };
  const onComplete = (val: any) => {
    // console.log('val:', val);
    setCode(val);
    setValidatedCode(true);
  };

  /** get code */
  const handleSendCode = async () => {
    try {
      const res = await getVerificationCodeReq({
        codeType: 0,
        email: email.trim(),
      });
      if (res.data.status === 1) {
        setSendCode(true);
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };
  /** create Account */
  const createAccount = async () => {
    try {
      console.log('code', code);
      if (code.length < 6) {
        setValidatedCode(false);
        return;
      }

      setCommitLoading(true);

      const res = await registerReq({
        code: code.trim(),
        email: email.trim(),
        username: username?.trim(),
        walletAddress: walletAddress?.trim(),
        password: password,
      });
      console.log('res', res);
      if (res.data.status === 1) {
        // 创建成功自动登录
        localStorage.setItem(TOKEN, res.data.data);
        mutateUserInfo();

        changeStep(3);
      } else if (res.data.status === 2000) {
        // 验证码错误
        setValidatedCode(false);
      }
      setCommitLoading(false);
    } catch (error) {
      // setValidatedCode(false);
      if ((error as any).code === 2000 || (error as any).code === 2001) {
        // 验证码错误
        setValidatedCode(false);
      }
      console.log((error as any).code);
      // message.error((error as Error).message);
      setCommitLoading(false);
    }
  };
  return (
    <div>
      <div className={clsx('', styles.container)}>
        <div className="flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center mb-[40px]">
            <div
              className={clsx(
                'text-[38px] leading-[46px] h-[58px] font-medium text-first',
                styles.title
              )}
            >
              {t('clientUI.signup.enterCode')}
            </div>
          </div>
          <div className="flex flex-col items-center">
            {sendCode && (
              <div className="text-[20px] leading-[30px] h-[40px] text-center font-[500]  mt-4 text-first ">
                {t('clientUI.signup.emailResent')}
              </div>
            )}
            <div className="text-[20px] leading-[30px] h-[58px]  text-first inline">
              {t('clientUI.signup.sentCode')} {email}
            </div>
          </div>
          <div>
            <div className="mt-4 my-[20px]">
              <CodeBox onCodeChange={onChange} onCodeComplete={onComplete} />
              {!validatedCode && (
                <div className="text-[16px] leading-[30px] h-[40px] text-center font-semibold  mt-4 !text-fourth">
                  {t('clientUI.signup.invalidCode')}
                </div>
              )}
            </div>
          </div>
          <div
            className={clsx(
              'flex flex-col items-center mb-[40px] mt-6',
              styles.tipsview
            )}
          >
            <div className="text-[20px] text-center leading-[30px] h-[58px]   text-first inline">
              {t('clientUI.signup.checkCode')}
              <span
                className="inline ml-2 cursor-pointer  line-clamp-1 underline"
                onClick={(e) => {
                  handleSendCode();
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {t('clientUI.signup.clickResend')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col items-center"> */}
      <div className=" flex justify-center">
        <button
          className="button-white !justify-center !p-[8px_30px] !h-[40px] w-[130px] !text-[16px] mt-12 "
          onClick={(e) => {
            e.preventDefault();
            changeStep(1);
          }}
        >
          {t('clientUI.cancel')}
        </button>

        <button
          className="button-green !p-[8px_34px] !justify-center w-[130px] !h-[40px] !text-[16px] mt-12 ml-[25px]"
          onClick={(e) => {
            createAccount();
          }}
        >
          {commitLoading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          {t('clientUI.signup.verify')}
        </button>
      </div>
    </div>
    // </div>
  );
};
export default EnterCode;
