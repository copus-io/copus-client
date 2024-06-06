import { message } from 'antd';
import Everpay from 'everpay';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  authLogin,
  getSnowflake,
  loginReq,
  loginWithArConnect,
  loginWithEverPay,
  loginWithMetamask,
} from 'src/api/user';
import { getBackUrl } from 'src/components/common';
import { isWebView } from 'src/hooks/use-navigator';
import useUserInfo from 'src/hooks/use-user-info';
import { md5Pwd } from 'src/utils/common';
import { publish } from 'src/utils/event';
import { TOKEN } from 'src/utils/statics';
import LoginView from './LoginView';
import Server from './serve';
import sns from '@seedao/sns-js';
import { updateExtendInfo } from 'src/api/user';
import useUserInfoReq from 'src/data/use-user-info';
interface ILoginType {
  handelSetStep: (value: number) => void;
  handelCancel: () => void;
}
const LoginPage = (props: ILoginType) => {
  const { handelSetStep, handelCancel } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const navBackUrl = getBackUrl(router);

  const [commitLoading, setCommitLoading] = useState(false);
  const { data: userinfo, mutate: mutateUserInfo } = useUserInfoReq();

  const [loading, setLoading] = useState({
    login: false,
    text: t('clientUI.loading'),
  });

  const goToThirdPartLoginWay = (type: string) => {
    if (type === 'everpay') {
      // loginByEverPay();
      loginByArConnect();
    }
    if (type === 'metamask') {
      loginByMetamask();
    }
    if (type === 'wallet') {
      onWalletConnect();
    }
    if (type === 'google') {
      loginByGoogle();
    }
  };

  const loginByEmail = async (values: any) => {
    try {
      if (commitLoading) return;
      setCommitLoading(true);
      const res = await loginReq({
        username: values.email.trim(),
        password: md5Pwd(values.password),
      });
      if (res.data.status === 1) {
        message.success('Success!');
        localStorage.setItem(TOKEN, res.data.data);
        mutateUserInfo();
      }
      setCommitLoading(false);
    } catch (error) {
      message.error((error as Error).message);
      setCommitLoading(false);
    }
  };

  // wc-2.0
  const onWalletConnect = async () => {
    try {
      clearAll();
      await Server.init(loginByWallet);
      await Server.provider.enable();
    } catch (error) {
      setLoading({
        login: false,
        text: 'error',
      });
    }
  };

  const loginByWallet = async (accounts: any) => {
    setLoading({
      login: false,
      text: 'error',
    });
    try {
      setLoading({
        login: true,
        text: t('clientUI.login.accountsTips'),
      });
      const res = await getSnowflake({ address: accounts[0] });
      if (res.data.status === 1) {
        const nonces = res.data.data;
        const msg = `0x${Buffer.from(nonces, 'utf8').toString('hex')}`;
        setLoading({
          login: true,
          text: t('clientUI.login.signTips'),
        });
        const result = await Server.provider.request({
          method: 'personal_sign',
          params: [msg, accounts[0]],
        });
        clearAll();
        setLoading({
          login: true,
          text: t('clientUI.login.signTips2'),
        });
        if (!result) return;
        const res2 = await loginWithMetamask({
          address: accounts[0],
          signature: result,
        });
        setLoading({
          login: false,
          text: t('clientUI.login.signTips2'),
        });
        if (res2.data.status === 1) {
          console.log('登录成功');
          message.success('Success!');
          localStorage.setItem(TOKEN, res2.data.data);

          mutateUserInfo();
          publish('UserLogin');
          router.push(navBackUrl);
        }
      }
    } catch (error) {}
  };

  const clearAll = async () => {
    indexedDB.deleteDatabase('WALLET_CONNECT_V2_INDEXED_DB');
    if (Server.provider) {
      Server.provider.reset();
      await Server.provider.disconnect();
    }
  };

  const isWebViews = isWebView();
  const [_, setType] = useState(0);
  useEffect(() => {
    if (loading.login) {
      setTimeout(() => {
        setLoading({
          login: false,
          text: '',
        });
        clearAll();
      }, 1000 * 60);
    }
    if (isWebViews) {
      setType(1);
    }
  }, [loading.login, isWebViews]);

  const loginByGoogle = async () => {
    try {
      const res = await authLogin({ type: 'google' });
      if (res.data.status === 1) {
        sessionStorage.setItem('cburl', navBackUrl);
        const url = res.data.data;
        const newRedirectURI = window.location.origin + '/callback';
        const updatedURL = replaceRedirectURI(url, newRedirectURI);
        window.location.href = updatedURL;
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  let ethAccount: any = null;
  let sign: any = null;
  let nonces: any = null;
  const loginByMetamask = async () => {
    setLoading({
      login: true,
      text: t('clientUI.login.accountsTips'),
    });
    await Server.init(loginByWallet);

    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts: any) => {
        ethAccount = accounts[0];
      })
      .then(async () => {
        setLoading({
          login: true,
          text: t('clientUI.login.signTips'),
        });

        const res = await getSnowflake({ address: ethAccount });
        if (res.data.status === 1) {
          nonces = res.data.data;
          const msg = `0x${Buffer.from(nonces, 'utf8').toString('hex')}`;
          window.ethereum
            .request({
              method: 'personal_sign',
              params: [msg, ethAccount],
            })
            .then(
              (res1: any) => {
                sign = res1;
              },
              (error: any) => {
                setLoading({
                  login: false,
                  text: t('clientUI.login.signTips2'),
                });
                if (error.code === 4001) {
                  message.error(error.message);
                }
                return;
              }
            )
            .then(async () => {
              try {
                if (!sign) return;
                setLoading({
                  login: true,
                  text: t('clientUI.login.signTips2'),
                });
                const res2 = await loginWithMetamask({
                  address: ethAccount,
                  signature: sign,
                });
                setLoading({
                  login: false,
                  text: t('clientUI.login.signTips2'),
                });
                if (res2.data.status === 1) {
                  message.success('Success!');
                  localStorage.setItem(TOKEN, res2.data.data);

                  mutateUserInfo();

                  // publish('UserLogin');
                  // handelCancel();

                  // router.push(navBackUrl);
                }
              } catch (error) {
                message.error((error as Error).message);
              }
            });
        }
      });
  };

  const loginByEverPay = async () => {
    try {
      const everpay = new Everpay();
      const accountAuthResult = await everpay.smartAccountAuth(
        'https://cascads31.s3.ca-central-1.amazonaws.com/images/client/202401/prod/8582d024a9884ed3b3e054e80a9e445f.png'
      );
      const everpaySign = new Everpay({
        account: accountAuthResult.account,
        isSmartAccount: true,
      });
      const res = await getSnowflake({ address: accountAuthResult.account });
      if (res.data.status === 1) {
        setLoading({
          login: true,
          text: 'clientUI.login.signTips2',
        });
        console.info('begin to SignMessage');
        const signMessageResult = await everpaySign.signMessage(
          res.data.data,
          true
        );
        console.log(
          'signMessageResult',
          signMessageResult,
          signMessageResult.sig
        );
        setLoading({
          login: true,
          text: 'clientUI.login.authLogin',
        });
        const loginRes = await loginWithEverPay({
          email: accountAuthResult.account,
          sig: signMessageResult.sig,
          everId: everpay.genEverId(accountAuthResult.account),
        });

        if (loginRes.data.status === 1) {
          message.success('Success!');
          localStorage.setItem(TOKEN, loginRes.data.data);

          mutateUserInfo();

          publish('UserLogin');
          router.push(navBackUrl);
        }
      }

      setLoading({
        login: false,
        text: t('clientUI.loading'),
      });
    } catch (error: any) {
      setLoading({
        login: false,
        text: t('clientUI.loading'),
      });
      message.error(error.message);
      console.log('error', error);
    }
  };

  async function loginByArConnect() {
    let connected = await connectArConnectWallet();
    if (connected) {
      let publicKey = await getArConnectWalletPublicKey();
      let walletAddress = await getArConnectWalletAddress();
      const res = await getSnowflake({ address: walletAddress });
      if (res.data.status === 1) {
        let signature = await arConnectWalletSignMsg(res.data.data);
        const loginRes = await loginWithArConnect({
          address: walletAddress,
          sig: signature,
          publicKey: publicKey,
        });
        if (loginRes.data.status === 1) {
          message.success('Success!');
          localStorage.setItem(TOKEN, loginRes.data.data);

          mutateUserInfo();

          // publish('UserLogin');
          // router.push(navBackUrl);
          // handelCancel();
        }
      }
    }
  }

  function replaceRedirectURI(url: string, newRedirectURI: string) {
    const redirectURIPattern = /redirect_uri=[^&]+/;
    if (redirectURIPattern.test(url)) {
      const updatedURL = url.replace(
        redirectURIPattern,
        `redirect_uri=${encodeURIComponent(newRedirectURI)}`
      );
      return updatedURL;
    }
    return url;
  }
  /**
   * 更新sns
   */
  useEffect(() => {
    if (userinfo) {
      if (userinfo.walletAddress) {
        sns.name(userinfo.walletAddress).then(async (value: string) => {
          await updateExtendInfo({ type: 0, value: value });
        });
      }
      handelCancel();
      publish('UserLogin');
      router.push(navBackUrl);
    }
  }, [userinfo]);

  return (
    <LoginView
      loading={loading}
      commitLoading={commitLoading}
      loginByEmail={loginByEmail}
      goToThirdPartLoginWay={goToThirdPartLoginWay}
      handelSetStep={handelSetStep}
    ></LoginView>
  );
};

async function getArConnectWalletAddress() {
  let address;
  try {
    address = await (window as any).arweaveWallet.getActiveAddress();
  } catch (error) {
    return '';
  }
  return address;
}

async function connectArConnectWallet() {
  try {
    await (window as any).arweaveWallet.connect([
      'ACCESS_ADDRESS',
      'SIGNATURE',
      'ACCESS_PUBLIC_KEY',
    ]);
  } catch (error) {
    message.error('You should connect to ArConnect browser extension.');
    return false;
  }
  return true;
}

// https://docs.arconnect.io/api/get-active-public-key
async function getArConnectWalletPublicKey() {
  let publicKey;
  try {
    publicKey = await (window as any).arweaveWallet.getActivePublicKey();
  } catch (error) {
    console.info(error);
    return '';
  }
  console.info(publicKey);
  return publicKey;
}

async function arConnectWalletSignMsg(msg: string) {
  const data = new TextEncoder().encode(msg);
  const signature = await (window as any).arweaveWallet.signMessage(data, {
    hashAlgorithm: 'SHA-256',
  });
  const base64Signature = Buffer.from(signature, 'base64').toString('base64');
  console.info(base64Signature);
  return base64Signature;
}

async function disconnectArConnectWallet() {
  await (window as any).arweaveWallet.disconnect();
}

export default LoginPage;
