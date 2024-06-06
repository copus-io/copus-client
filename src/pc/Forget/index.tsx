import { Input, message } from 'antd';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { findBackPswReq, getVerificationCodeReq } from 'src/api/user';
import { md5Pwd, validateEmail } from 'src/utils/common';
import styles from './index.module.less';

interface ForgetPageProps {
  handelSetStep: (step: number) => void;
}

const ForgetPage = (props: ForgetPageProps) => {
  const { handelSetStep } = props;
  const { t } = useTranslation();

  const router = useRouter();

  const [data, setData] = useState<{
    email: string;
    code: string;
    password: string;
    confirmPwd: string;
  }>({
    email: '',
    code: '',
    password: '',
    confirmPwd: '',
  });
  const [commitLoading, setCommitLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [sentEmail, setSentEmail] = useState('');

  const handleSendCode = async () => {
    if (!data.email) {
      message.warning(t('clientUI.signup.emailAddress'));
      return;
    }
    if (!validateEmail(data.email)) {
      message.warning(t('clientUI.signup.emailAddressError'));
      return;
    }
    if (codeLoading) return;
    try {
      setCodeLoading(true);
      const res = await getVerificationCodeReq({
        codeType: 1,
        email: data.email.trim(),
      });
      if (res.data.status === 1) {
        message.success(t('clientUI.forget.codeSended'));
        const email = data.email;
        let str = email.split('@');
        const str1 = str[0].substring(0, 1) + '*****@' + str[1];
        setSentEmail(str1);
        setStatus(1);
      }
      setCodeLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCodeLoading(false);
    }
  };

  const checkFields = () => {
    if (!data.password) {
      message.warning(t('clientUI.signup.passwordMessage'));
      return false;
    }
    if (!data.confirmPwd) {
      message.warning(t('clientUI.signup.confirmPasswordMessage'));
      return false;
    }
    if (data.password !== data.confirmPwd) {
      message.warning(t('clientUI.signup.confirmPasswordError'));

      return false;
    }
    return true;
  };

  const changePwd = async () => {
    try {
      if (!checkFields()) return;
      setCommitLoading(true);
      const res = await findBackPswReq({
        code: data.code.trim(),
        password: md5Pwd(data.password),
        email: data.email.trim(),
      });
      if (res.data.status === 1) {
        message.success(t('clientUI.forget.success'));
        handelSetStep(0);
      }
      setCommitLoading(false);
    } catch (error: any) {
      message.error((error as Error).message);
      setCommitLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto ">
      <div className="flex  items-center justify-center h-full">
        <div
          className={clsx(
            'flex flex-col w-[480px]  items-center justify-center pt-[92px] pb-[40px]',
            styles.container
          )}
        >
          {status === 0 ? (
            <>
              <div>
                <div
                  className={clsx(
                    'text-[38px] leading-[46px] h-[48px] font-[500] text-first',
                    styles.title
                  )}
                >
                  {t('clientUI.login.forgotPassword')}
                </div>
                <div className={styles.noticeText}>
                  {t('clientUI.login.forgotPasswordTips')}
                </div>
                <Input
                  type="text"
                  placeholder={t('clientUI.signup.emailAddressPlaceholder')}
                  id="forget-email"
                  value={data.email}
                  onChange={(e) =>
                    setData((data) => ({
                      ...data,
                      email: e.target.value,
                    }))
                  }
                  className={clsx('!mt-[30px] ', styles.input)}
                />
              </div>

              <div className=" flex justify-center">
                <button
                  className="button-white !justify-center !p-[8px_30px] !h-[40px] w-[130px] !text-[16px] mt-12 "
                  onClick={(e) => {
                    e.preventDefault();
                    handelSetStep(0);
                  }}
                >
                  {t('clientUI.cancel')}
                </button>

                <button
                  className="button-green !p-[8px_34px] whitespace-nowrap !justify-center w-[130px] !h-[40px] !text-[16px] mt-12 ml-[25px]"
                  onClick={handleSendCode}
                >
                  {codeLoading && (
                    <span className="mr-2">
                      <i className="fa fa-circle-o-notch fa-spin " />
                    </span>
                  )}
                  {t('clientUI.forget.sendCode')}
                </button>
              </div>
            </>
          ) : status === 1 ? (
            <>
              <div>
                <div
                  className={clsx(
                    'text-[38px] leading-[46px] h-[48px] font-medium text-first',
                    styles.title
                  )}
                >
                  Enter verification code
                </div>
                <div className={styles.noticeEmail}>
                  {t('clientUI.forget.weSentYourCode')}
                  {sentEmail}
                </div>
                <Input
                  type="text"
                  placeholder={t('clientUI.forget.enterCode')}
                  id="forget-code"
                  value={data.code}
                  onChange={(e) =>
                    setData((data) => ({
                      ...data,
                      code: e.target.value,
                    }))
                  }
                  className={clsx('!mb-[30px] ', styles.input)}
                />
              </div>
              <div className="text-first text-[16px] w-[340px] ">
                Didn’t get the code? Please check your spam folder or
                <span
                  className={styles.forget}
                  onClick={() => {
                    message.warning(t('clientUI.forget.verificationCode'));
                    handleSendCode();
                  }}
                >
                  click to resend.
                </span>
              </div>
              <div className=" flex justify-center">
                <button
                  className="button-white !justify-center !p-[8px_30px] !h-[40px] w-[130px] !text-[16px] mt-12 "
                  onClick={(e) => {
                    e.preventDefault();
                    handelSetStep(0);
                  }}
                >
                  {t('clientUI.cancel')}
                </button>

                <button
                  className="button-green !p-[8px_34px] whitespace-nowrap !justify-center w-[130px] !h-[40px] !text-[16px] mt-12 ml-[25px]"
                  onClick={() =>
                    data.code
                      ? setStatus(2)
                      : message.error(t('clientUI.forget.codeMessage'))
                  }
                >
                  Verify
                </button>
              </div>
            </>
          ) : (
            <div className="w-[420px]">
              <div className={styles.reset}>Reset password</div>
              <div className={styles.subTitle}>
                Make sure your new password is 8 characters or more. Try
                including numbers, letters, and punctuation marks for a strong
                password.
              </div>
              <div className={styles.label} style={{ marginTop: '30px' }}>
                {t('clientUI.signup.password')}
              </div>
              <div>
                <Input.Password
                  placeholder={t('clientUI.signup.passwordPlaceholder')}
                  value={data.password}
                  onChange={(e) =>
                    setData((data) => ({
                      ...data,
                      password: e.target.value.trim(),
                    }))
                  }
                  className={clsx('!mt-[15px] !w-[100%]', styles.input)}
                />
              </div>
              <div>
                <Input.Password
                  value={data.confirmPwd}
                  id="forget-confirm-password"
                  onChange={(e) =>
                    setData((data) => ({
                      ...data,
                      confirmPwd: e.target.value.trim(),
                    }))
                  }
                  placeholder={t('clientUI.signup.confirmPasswordPlaceholder')}
                  className={clsx('!mt-[15px] !w-[100%]', styles.input)}
                />
              </div>
              <div className=" flex justify-center">
                <button
                  className="button-white !justify-center !p-[8px_30px] !h-[40px] w-[130px] !text-[16px] mt-12 "
                  onClick={(e) => {
                    e.preventDefault();
                    handelSetStep(0);
                  }}
                >
                  {t('clientUI.cancel')}
                </button>

                <button
                  className="button-green !p-[8px_34px] whitespace-nowrap !justify-center w-[130px] !h-[40px] !text-[16px] mt-12 ml-[25px]"
                  onClick={changePwd}
                >
                  {commitLoading && (
                    <span className="mr-1">
                      <i className="fa fa-circle-o-notch fa-spin " />
                    </span>
                  )}
                  {t('clientUI.continue')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgetPage;
