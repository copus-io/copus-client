import { Form, Input, message } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { checkEmailExistReq, getVerificationCodeReq } from 'src/api/user';
import { md5Pwd, validateEmail } from 'src/utils/common';
import styles from './index.module.less';

const InputEmail = (props: any) => {
  const { changeStep } = props;
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const [codeLoading, setCodeLoading] = useState(false);
  // 设置当前步骤
  // const [step, setStep] = useState(1);
  // true 邮箱已经注册
  const [validatedEmail, setValidatedEmail] = useState(false);
  // const [validatedUsername, setValidatedUsername] = useState(false);

  const emailValue = Form.useWatch('email', form);
  const usernameValue = Form.useWatch('username', form);
  // 检测用户名是否已经使用
  const checkEmailFunc = async () => {
    if (validateEmail(emailValue)) {
      const checkEmailRes = await checkEmailExistReq({
        email: emailValue.trim(),
      });
      if (checkEmailRes.data.data) {
        setValidatedEmail(true);
      } else {
        setValidatedEmail(false);
      }
    }
  };

  /** get code */
  const handleSendCode = async (values: any) => {
    try {
      setCodeLoading(true);
      // 检测邮箱是否存在
      const checkEmailRes = await checkEmailExistReq({
        email: emailValue.trim(),
      });

      if (checkEmailRes.data.data) {
        setValidatedEmail(true);
        setCodeLoading(false);
        return;
      } else {
        setValidatedEmail(false);
      }

      const res = await getVerificationCodeReq({
        codeType: 0,
        email: emailValue.trim(),
      });
      if (res.data.status === 1) {
        let signProps = {
          step: 2,
          email: values.email,
          username: values.username,
          password: md5Pwd(values.password),
          walletAddress: '',
          changeStep: changeStep,
        };
        changeStep(2, signProps);
      }
      setCodeLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCodeLoading(false);
    }
  };

  return (
    <div>
      <div className="">
        <div className={clsx('', styles.container)}>
          <div className="flex flex-col items-center   mb-[40px]">
            <div
              className={clsx(
                'text-[38px] leading-[46px] h-[58px] font-medium text-first',
                styles.title
              )}
            >
              {t('clientUI.signup.createYourAccount')}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Form
              form={form}
              className={styles.formCon}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={handleSendCode}
              autoComplete="off"
              layout="vertical"
              colon={false}
            >
              <Form.Item
                name="email"
                className="!mb-5 formLabel"
                label={t('clientUI.signup.emailAddress')}
                validateFirst={true}
                rules={[
                  {
                    validator: (_, value) => {
                      if (validateEmail(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(
                          new Error(t('clientUI.signup.emailAddressError'))
                        );
                      }
                    },
                  },
                  {
                    required: true,
                    message: t('clientUI.signup.emailAddressMessage'),
                  },
                ]}
              >
                <Input
                  className={styles.input}
                  placeholder={t('clientUI.signup.emailAddressPlaceholder')}
                  onBlur={checkEmailFunc}
                />
              </Form.Item>
              {validatedEmail && (
                <div className="text-[16px] leading-[30px] h-[40px]  font-semibold  mt-4 !text-fourth">
                  {t('clientUI.signup.validatedEmail')}
                </div>
              )}
              <Form.Item
                name="username"
                className="!mb-5 formLabel"
                label={t('clientUI.signup.username')}
              >
                <Input
                  className={styles.input}
                  placeholder={t('clientUI.signup.usernamePlaceholder')}
                  autoComplete="off"
                  onFocus={(e) => {
                    console.log('onFocus', e.target.value);
                  }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                className="!mb-5 formLabel "
                label={t('clientUI.signup.password')}
                rules={[
                  {
                    required: true,
                    message: t('clientUI.signup.passwordMessage'),
                  },
                ]}
              >
                <Input.Password
                  className={styles.input}
                  placeholder={t('clientUI.signup.passwordPlaceholder')}
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                className="!mb-5"
                validateFirst
                name="confirmpassword"
                rules={[
                  {
                    required: true,
                    message: t('clientUI.signup.confirmPasswordMessage'),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t('clientUI.signup.confirmPasswordError'))
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  className={styles.input}
                  placeholder={t('clientUI.signup.confirmPasswordPlaceholder')}
                  autoComplete="new-password"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="flex justify-center mb-0 mt-[20px] pb-6">
          <button className={styles.mineBtn} onClick={form.submit}>
            {codeLoading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            {t('clientUI.signup.signup')}
          </button>
        </div>
        <div
          className={clsx(
            'text-[16px] font-[400] flex h-[auto] justify-center',
            styles.tipsview
          )}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <div className="mr-[5px] inline">{t('clientUI.signup.agree')}</div>
          <a
            className="font-[500]  underline underline-offset-2 inline"
            href="https://www.copus.io/work/565b548277674c3bae3ccc016c7f58a2"
            target="_blank"
          >
            {t('clientUI.signup.service')}
          </a>
        </div>
      </div>
    </div>
  );
};
export default InputEmail;
