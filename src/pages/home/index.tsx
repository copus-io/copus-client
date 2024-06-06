import dynamic from 'next/dynamic';
import Head from 'next/head';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});
const Home = dynamic(() => import('src/pc/Home'), {
  ssr: false,
});

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Layout>
        <Home />
      </Layout>
    </>
  );
};
export default LoginPage;
