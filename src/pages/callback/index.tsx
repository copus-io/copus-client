import dynamic from 'next/dynamic';
import Head from 'next/head';
// import Layout from 'src/components/Layout';

// 客户端渲染
const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});
const Callback = dynamic(() => import('src/pc/Callback'), {
  ssr: false,
});

const CreatePage = () => {
  return (
    <>
      <Head>
        <title>Copus</title>
      </Head>
      <Layout>
        <Callback />
      </Layout>
    </>
  );
};

export default CreatePage;
