import { ReactNode, useEffect, useState, useRef } from 'react';
import { ReactComponent as PlusIcon } from 'src/assets/media/svg2/icon-plus.svg';
import { ReactComponent as SubmitIcon } from 'src/assets/media/svg2/icon-submit.svg';
import SpaceHomeMenu from './SpaceHomeMenu';
import styles from './index.module.less';

import router from 'next/router';
import { useTranslation } from 'react-i18next';
import useSpaceDetailReq from 'src/data/use-space-detail';
import useRouterParams from 'src/hooks/use-router-params';
import useUserInfo from 'src/hooks/use-user-info';
import CuratorCenter from 'src/pc/modalViews/CuratorCenter';
import InviteMembers from 'src/pc/modalViews/InviteMember';
import SpaceSetting from 'src/pc/modalViews/SpaceSetting';
import SubmitWorkModal from 'src/pc/modalViews/SubmitWorkModal';
import { publish, subscribe } from 'src/utils/event';
import CreateOpusModal from '../Menu/CreateOpusModal';
import { CommonModal } from '../ModalPro';
import TopBar from '../TopBar';

import Link from 'next/link';

const SpaceLayout = ({ children }: { children: ReactNode }) => {
  const { spaceId } = useRouterParams();
  const { t, i18n } = useTranslation();
  const { data: userInfo } = useUserInfo();

  const { data: spaceDetail, mutate: mutateSpaceDetail } =
    useSpaceDetailReq(spaceId);
  const [openSubmitWorkWindow, setOpenSubmitWorkWindow] =
    useState<boolean>(false);
  const [openInvite, setOpenInvite] = useState<boolean>(false);
  const [openSpaceSetting, setOpenSpaceSetting] = useState<boolean>(false);
  const [openCuratorCenter, setOpenCuratorCenter] = useState<boolean>(false);
  const [openOpusCreateModal, setOpenOpusCreateModal] = useState(false);
  const handleCancelCallback = () => {
    setOpenSubmitWorkWindow(false);
    setOpenInvite(false);
    setOpenSpaceSetting(false);
    setOpenCuratorCenter(false);
    setOpenOpusCreateModal(false);
  };

  useEffect(() => {
    subscribe('gotoSpaceSetting', () => {
      setOpenCuratorCenter(false);
      setOpenSpaceSetting(true);
    });
  }, []);

  const handelOpen = (type?: number) => {
    if (!userInfo) {
      publish('showLoginView');
      return;
    }

    if (type === 1) {
      setOpenSubmitWorkWindow(true);
    }
    if (type === 2) {
      setOpenInvite(true);
    }
    if (type === 3) {
      setOpenSpaceSetting(true);
    }
    if (type === 4) {
      setOpenCuratorCenter(true);
    }
  };
  /** hook */
  const [family, setFamily] = useState('');
  const lang = localStorage.getItem('lang') || 'en';
  /** 存储数据 */
  useEffect(() => {
    if (lang === 'en') {
      setFamily('Maven Pro');
    } else {
      setFamily('Noto Sans SC');
    }
  }, [lang]);
  const scrollRef = useRef<any>(null);
  useEffect(() => {
    const handler = function (this: HTMLElement, e: Event) {
      // scrollHeight是可滚动区域的总高度， innerHeight是可视窗口的高度， scrollTop是盒子可视窗口的最顶部，到盒子可滚动上限的距离
      // 还有一个可以性能优化的点， this.scrollHeight 在没有获取新数据时，是固定的，可以存起来成一个变量，获取新数据再更新，减少重排重绘
      // console.log('this.scrollHeight', this.scrollTop);
      if (this.scrollTop > 271) {
        publish('setFiex', 1);
      } else {
        publish('setFiex1', 0);
      }
    };
    scrollRef.current?.addEventListener('scroll', handler);
  });
  /** 创建 */
  const onClickStartCreating = () => {
    if (!userInfo) {
      publish('showLoginView');
      return;
    }

    router.push(`/create?spaceId=${spaceId}&cburl=${router.asPath}`);
  };

  const mutateData = () => {
    mutateSpaceDetail();
  };

  function isInSpace(): boolean {
    if (spaceDetail && spaceDetail.role >= 0) {
      return true;
    }
    return false;
  }

  const showSubmitBtn = isInSpace();

  return (
    <div
      className="h-full flex select-none"
      style={{
        fontFamily: family,
      }}
    >
      <div className="flex  w-full  overflow-hidden relative">
        <div className="flex-1 w-full overflow-hidden  ">
          <div className="h-full ">
            <div className="top">
              <TopBar type={1} />
            </div>
            <div
              className="flex"
              style={{
                height: 'calc(100% - 63px)',
              }}
            >
              <div className={styles.menu}>
                <SpaceHomeMenu
                  spaceDetail={spaceDetail!}
                  handelOpen={handelOpen}
                  mutateData={mutateData}
                />
              </div>
              <div
                className="flex-1 mx-[auto] px-[20px]"
                ref={scrollRef}
                style={{
                  overflowY: 'auto',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                <div className="w-[full] h-[230px] my-[20px] relative">
                  {spaceDetail?.coverUrl !== '' && spaceDetail?.coverUrl ? (
                    <img
                      src={spaceDetail?.coverUrl}
                      className="rounded-[10px]"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  ) : (
                    <div className={styles.defaultBanner}></div>
                  )}
                </div>

                {children}

                <div className="flex-row  items-start absolute top-[200px] right-[60px]">
                  <div
                    onClick={onClickStartCreating}
                    className="border-1 border-[#484848] flex items-center !py-[10px] mt-[10px]  px-[15px] font-[500] rounded-full border  bg-[#fff] hover:bg-[#eee] cursor-pointer"
                  >
                    <PlusIcon className="text-[#484848] mr-[6px]"></PlusIcon>
                    {t('clientUI.startCreating.name')}
                  </div>

                  {showSubmitBtn && (
                    <div
                      onClick={() => {
                        setOpenSubmitWorkWindow(true);
                      }}
                      className="flex border-1 border-[#484848] items-center !py-[10px] mt-[10px]  px-[15px] font-[500] rounded-full border  bg-[#fff] hover:bg-[#eee] cursor-pointer"
                    >
                      <SubmitIcon className="text-first mr-[6px]"></SubmitIcon>{' '}
                      {t('clientUI.curatorSpaceHome.submitWork')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openSubmitWorkWindow && (
        <CommonModal handleCancelCallback={handleCancelCallback}>
          <SubmitWorkModal spaceId={spaceId} />
        </CommonModal>
      )}

      {openInvite && (
        <CommonModal handleCancelCallback={handleCancelCallback}>
          <InviteMembers spaceId={spaceId} />
        </CommonModal>
      )}

      {openCuratorCenter && (
        <CommonModal handleCancelCallback={handleCancelCallback}>
          <CuratorCenter spaceId={spaceId} />
        </CommonModal>
      )}

      {openOpusCreateModal && (
        <CreateOpusModal
          open={openOpusCreateModal}
          spaceNamespace={spaceId}
          handleCancelCallback={handleCancelCallback}
        ></CreateOpusModal>
      )}

      {openSpaceSetting && (
        <CommonModal
          open={openSpaceSetting}
          handleCancelCallback={handleCancelCallback}
          title={t('clientUI.spaceSetting.name')}
        >
          <SpaceSetting spaceId={spaceId} />
        </CommonModal>
      )}
    </div>
  );
};
export default SpaceLayout;
