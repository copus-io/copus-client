import 'src/assets/css/components.less';
import 'src/assets/css/global.less';
import 'src/assets/css/index.css';
import 'src/assets/css/tailwind.css';
// lexical css 引入
// import 'src/assets/css/lexicalcss/Collapsible.css';
// import 'src/assets/css/lexicalcss/DraggableBlockPlugin.css';
// import 'src/assets/css/lexicalcss/EditorTheme.css';
// import 'src/assets/css/lexicalcss/FloatingLinkEditorPlugin.css';
// import 'src/assets/css/lexicalcss/FloatingTextFormatToolbarPlugin.css';
// import 'src/assets/css/lexicalcss/playground.css';

import 's31-editor/dist/lib/style.css';

import { ConfigProvider, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from 'src/pc/ErrorBoundary';
import { SWRConfig } from 'swr';
import '../lang/config'; // 引用配置文件
import UserInfoProvider from './UserInfoProvider';
dayjs.extend(relativeTime);

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 3000,
  // keepPreviousData: true,
};
message.config({
  maxCount: 3,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Copus - Co-create Anything!</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </Head>
      <ErrorBoundary>
        <RecoilRoot>
          <ConfigProvider
            theme={{
              components: {
                Message: {
                  zIndexPopup: 9999,
                  contentBg: '#FF0000',
                },
              },
            }}
          >
            <SWRConfig value={swrConfig}>
              <UserInfoProvider>
                <div style={{ height: '100vh' }} className="flex flex-col">
                  <Component {...pageProps} />
                </div>
              </UserInfoProvider>
            </SWRConfig>
          </ConfigProvider>
        </RecoilRoot>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
