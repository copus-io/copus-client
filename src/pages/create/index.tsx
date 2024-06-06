import dynamic from 'next/dynamic';
import Head from 'next/head';
import LoginCheck from 'src/pc/LoginCheck';

// 客户端
const Create = dynamic(() => import('src/pc/Create'), {
  ssr: false,
});

const CreatorCenterPage = () => {
  return (
    <LoginCheck>
      <Head>
        <title>Create</title>
      </Head>
      <Create />
    </LoginCheck>
  );
};
export default CreatorCenterPage;
