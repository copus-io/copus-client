import { t } from 'i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { HeadMetaData, spaceMetaInfoReq } from 'src/api/space';
import Login from 'src/components/Login';
import TopBar from 'src/components/TopBar';
import useSpaceDetailReq from 'src/data/use-space-detail';
import useUserInfoReq from 'src/data/use-user-info';
import useRouterParams from 'src/hooks/use-router-params';
import { subscribe } from 'src/utils/event';
import Page404 from '../404';
import styles from './index.module.less';

const SpaceLayout = dynamic(() => import('src/components/SpaceLayout'), {
  ssr: false,
});

const SpacePieceIndex = dynamic(() => import('src/pc/Space/home'), {
  ssr: false,
});

export default function SpacePage({ detail }: HeadMetaData) {
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);

  const { spaceId } = useRouterParams();
  const {
    data: spaceDetail,
    mutate: spaceMutate,
    isLoading: spaceLoading,
    error,
  } = useSpaceDetailReq(spaceId);

  const { data: userInfo, isLoading: userLoading } = useUserInfoReq();

  useEffect(() => {
    subscribe('UserLogin', () => {
      spaceMutate();
    });
  }, []);

  function getView() {
    if (error) {
      return <Page404 />;
    }

    if (spaceLoading || userLoading) {
      return tipsPage('loading...');
    }

    if (spaceDetail?.accessLevel === 0 || spaceDetail?.accessLevel === 10) {
      return spaceView();
    }

    if (!spaceDetail && !userInfo) {
      return tipsPage(
        <div className="text-center font-[500] text-[25px] leading-6 flex flex-col gap-[10px]">
          <div>This is a private space</div>
          <div>Please log in to check your access.</div>
        </div>,
        1
      );
    }

    if (!spaceDetail && userInfo) {
      return tipsPage('You don’t have access to this private space.');
    }

    if (spaceDetail!.role >= 0) {
      return spaceView();
    }

    return tipsPage('Error user role');
  }

  return getView();

  function tipsPage(tips: React.ReactNode, type: number = 0) {
    return (
      <div className={styles.divBg}>
        <TopBar />
        <div className="h-[90vh] flex flex-col items-center justify-center font-[500] text-[25px]">
          {tips}
          {otherInfoView(type)}
        </div>

        <Login
          open={openLoginModal}
          handleCancelCallback={() => {
            setOpenLoginModal(false);
          }}
        ></Login>
      </div>
    );
  }

  function otherInfoView(type: number) {
    if (type === 1) {
      return (
        <div
          onClick={() => {
            setOpenLoginModal(true);
          }}
          className="rounded-full text-[16px] font-[500] bg-[#484848] text-[#fff] flex items-center gap-[6px]  px-[20px] py-[10px] mr-[30px] cursor-pointer mt-[30px]"
        >
          {t('clientUI.login.btnName')}
        </div>
      );
    }
  }

  function spaceView() {
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
        <SpaceLayout>
          <SpacePieceIndex />
        </SpaceLayout>
      </>
    );
  }
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
  try {
    const resp = await spaceMetaInfoReq(spaceId);
    if (resp.data.status === 1) {
      return { props: { detail: resp.data.data } };
    }
  } catch (error) {}

  const res = {
    title: spaceId,
    coverUrl: '',
    subTitle: '',
  };
  return { props: { detail: res } };
}
