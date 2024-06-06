import dynamic from 'next/dynamic';
import Head from 'next/head';
import LoginCheck from 'src/pc/LoginCheck';

const WorkLayout = dynamic(() => import('src/components/WorkLayout'), {
  ssr: false,
});
const CreatorCenter = dynamic(() => import('src/pc/CreatorCenter'), {
  ssr: false,
});

const CreatePage = () => {
  return (
    <LoginCheck>
      <Head>
        <title>creatorCenter</title>
      </Head>
      <WorkLayout>
        <CreatorCenter></CreatorCenter>
      </WorkLayout>
    </LoginCheck>
  );
};
export default CreatePage;
