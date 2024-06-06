import dynamic from 'next/dynamic';
import Head from 'next/head';
import { HeadMetaData } from 'src/api/space';
import { opusMetaInfoReq } from 'src/api/work';
import Loading from 'src/components/Loading';
import { useOpusDetailReq } from 'src/data/use-work-detail';
import useRouterParams from 'src/hooks/use-router-params';
import Page404 from 'src/pages/404';

const Work = dynamic(() => import('src/pc/Work'), {
  ssr: false,
});

const WorkLayout = dynamic(() => import('src/components/WorkLayout'), {
  ssr: false,
});

export default function WorkPage({ detail }: HeadMetaData) {
  const { workUuid } = useRouterParams();
  const { data: articleData, isLoading, error } = useOpusDetailReq(workUuid);

  function getView() {
    if (error) {
      return <Page404 />;
    }

    if (isLoading) {
      return <Loading />;
    }

    return postView();
  }

  return getView();

  function postView() {
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
        <WorkLayout>
          <Work articleData={articleData!}></Work>
        </WorkLayout>
      </>
    );
  }
}

export async function getServerSideProps({
  params,
}: {
  params: { workUuid: string };
}) {
  const { workUuid } = params;
  try {
    const resp = await opusMetaInfoReq(workUuid);
    if (resp.data.status === 1) {
      return { props: { detail: resp.data.data } };
    }
  } catch (error) {}

  const res = {
    title: workUuid,
    coverUrl: '',
    subTitle: '',
  };
  return { props: { detail: res } };
}
