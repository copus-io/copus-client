import dynamic from 'next/dynamic';
import Head from 'next/head';
import { HeadMetaData } from 'src/api/space';
import { userSpaceMetaInfoReq } from 'src/api/userSpace';

// 客户端渲染
const UserLayout = dynamic(() => import('src/components/UserLayout'), {
  ssr: false,
});

const UserHome = dynamic(() => import('src/pc/User/home'), {
  ssr: false,
});

export default function UserHomePage({ detail }: HeadMetaData) {
  return (
    <>
      <Head>
        <title>{detail?.title}</title>
        <meta name="description" content={detail?.subTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="Copus" />
        <meta name="twitter:title" content={detail?.title} />
        <meta name="twitter:type" content="website" />
        <meta name="twitter:image" content={detail?.coverUrl} />
        <meta name="twitter:description" content={detail?.subTitle} />
        <meta property="og:title" content={detail?.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={detail?.coverUrl} />
        <meta property="og:description" content={detail?.subTitle} />
      </Head>
      <UserLayout>
        <UserHome />
      </UserLayout>
    </>
  );
}

// export async function getStaticPaths() {
//   return { paths: [], fallback: true };
// }

export async function getServerSideProps({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  try {
    const resp = await userSpaceMetaInfoReq(userId);
    if (resp.data.status === 1) {
      return { props: { detail: resp.data.data } };
    }
  } catch (error) {}

  const res = {
    title: userId,
    coverUrl: '',
    subTitle: '',
  };
  return { props: { detail: res } };
}
