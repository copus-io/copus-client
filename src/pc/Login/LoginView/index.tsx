import { Form, Input, Spin } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

import { ReactComponent as GoogleIcon } from 'src/assets/media/svg2/ic-google.svg';
import { ReactComponent as MetamaskIcon } from 'src/assets/media/svg2/ic-metamask.svg';
import { ReactComponent as WalletIcon } from 'src/assets/media/svg2/ic-walletconnect.svg';
import { ReactComponent as ArConnectLogo } from 'src/assets/media/svg2/logo-ar.svg';

interface LoginViewProps {
  loading: any;
  commitLoading: boolean;
  goToThirdPartLoginWay: (type: string) => void;
  handelSetStep: (type: number) => void;
  loginByEmail: (values: any) => void;
}

export default function LoginView({
  loading,
  commitLoading,
  goToThirdPartLoginWay,
  handelSetStep,
  loginByEmail: loginByEmail,
}: LoginViewProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const loginWayList = [
    {
      icon: <GoogleIcon></GoogleIcon>,
      name: 'Google',
      type: 'google',
    },
    {
      icon: <MetamaskIcon></MetamaskIcon>,
      name: 'Metamask',
      type: 'metamask',
    },
    {
      icon: <ArConnectLogo width={20} height={20}></ArConnectLogo>,
      name: 'ArConnect',
      type: 'everpay',
    },
    {
      icon: <WalletIcon></WalletIcon>,
      name: 'WalletConnect',
      type: 'wallet',
    },
  ];

  return (
    <div className="overflow-y-auto h-full">
      <div className="h-full min-h-[600px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center pb-[48px] w-full">
          <div className="flex flex-col items-center">
            <div className="text-first text-[25px] leading-[34px] font-medium h-[58px] mt-[60px]">
              {t('clientUI.login.title')}
            </div>
          </div>
          <div
            className={clsx(
              'flex flex-col items-center relative',
              styles.container
            )}
          >
            <Form
              className={styles.formCon}
              form={form}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={loginByEmail}
              layout="vertical"
              autoComplete="off"
              colon={false}
            >
              <Form.Item
                name="email"
                className="!mb-[20px] formLabel"
                label={t('clientUI.login.emailAddress')}
                validateFirst={true}
                rules={[
                  { type: 'email' },
                  {
                    required: true,
                    message: t('clientUI.login.emailAddressMessage'),
                  },
                ]}
              >
                <Input
                  className={styles.input}
                  placeholder={t('clientUI.login.emailAddressPlaceholder')}
                />
              </Form.Item>
              <Form.Item
                name="password"
                className="!mb-[0px] formLabel"
                label={t('clientUI.login.password')}
                rules={[
                  {
                    required: true,
                    message: t('clientUI.login.passwordMessage'),
                  },
                ]}
              >
                <Input.Password
                  className={styles.input}
                  placeholder={t('clientUI.login.passwordPlaceholder')}
                />
              </Form.Item>
            </Form>
            <div
              className={styles.forget}
              onClick={() => {
                handelSetStep(2);
              }}
            >
              {t('clientUI.login.forgotPassword')}
            </div>
            <div
              className={styles.mineBtnYellow}
              onClick={() => handelSetStep(1)}
            >
              {t('clientUI.login.noAccount')}{' '}
              <span>{t('clientUI.login.createOne')}</span>
            </div>
            <div style={{ marginTop: '20px', width: '100%' }}>
              <div className={styles.mineBtn} onClick={form.submit}>
                {commitLoading && (
                  <span className="mr-2">
                    <i className="fa fa-circle-o-notch fa-spin " />
                  </span>
                )}
                {t('clientUI.login.login')}
              </div>
            </div>

            <div className={styles.divider}>
              <span>{t('clientUI.login.orSignIn')}</span>
            </div>
          </div>
          <div className={clsx('w-[400px]', styles.metamaskCon)}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}
            >
              {loginWayList.map((item) => (
                <div
                  className={clsx(
                    `cursor-pointer  w-[189px] mt-[20px] rounded-[40px] py-[15px] duration-300 flex items-center justify-center border border-border `,
                    styles.itemCon
                  )}
                  key={item.name}
                  onClick={() => goToThirdPartLoginWay(item.type)}
                >
                  {item.icon}
                  <span className="ml-[10px]">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-[24px]">
              <div className="mr-[5px] inline">{t('clientUI.login.agree')}</div>
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
      </div>
      {loading.login ? (
        <div className={styles.mask}>
          <Spin tip={loading.text}></Spin>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
