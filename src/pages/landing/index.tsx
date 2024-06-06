import dynamic from 'next/dynamic';
import Head from 'next/head';
// import LandingLayout from 'src/components/LandingLayout';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});
const Landing = dynamic(() => import('src/pc/Landing'), {
  ssr: false,
});

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Intro to Copus."></meta>
      </Head>
      <Layout>
        <Landing />
      </Layout>
    </>
  );
};
export default LandingPage;
