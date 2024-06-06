import Head from 'next/head';
import { spaceMetaInfoReq } from 'src/api/space';

interface CallBackParams {
  detail: {
    title: string;
    logoUrl: string;
    description: string;
  };
}

export default function TestPage({ detail }: CallBackParams) {
  return (
    <>
      <Head>
        <title>{detail?.title}</title>
        <meta name="description" content={detail?.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="Copus" />
        <meta name="twitter:title" content={detail?.title} />
        <meta name="twitter:type" content="website" />
        <meta name="twitter:image" content={detail?.logoUrl} />
        <meta name="twitter:description" content={detail?.description} />
        <meta property="og:title" content={detail?.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={detail?.logoUrl} />
        <meta property="og:description" content={detail?.description} />
      </Head>
      <div>{detail?.title}</div>
      <div>{detail?.description}</div>
      <div>test 2</div>
    </>
  );
}

// export async function getStaticPaths() {
//   return { paths: [], fallback: true };
// }

export async function getServerSideProps({
  params,
}: {
  params: { spaceId: string };
}) {
  const { spaceId } = params;

  let errorRes = {
    title: spaceId,
    logoUrl: '',
    description: '',
  };

  try {
    const data = await spaceMetaInfoReq(spaceId);
    const res = {
      title: data.data.data.title,
      logoUrl: data.data.data.coverUrl,
      description: data.data.data.subTitle,
    };
    return { props: { detail: res } };
  } catch (error) {
    errorRes.description = 'error ' + error;
  }

  return { props: { detail: errorRes } };
}
