import router from 'next/router';
import { ReactNode, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as EditIcon } from 'src/assets/media/svg2/icon-edit.svg';
import { ReactComponent as PlusIcon } from 'src/assets/media/svg2/icon-plus.svg';
import useUserHomeDetailReq from 'src/data/use-userHome-detail';
import useRouterParams from 'src/hooks/use-router-params';
import useUserInfo from 'src/hooks/use-user-info';
import UserSetting from 'src/pc/modalViews/UserSetting';
import { publish } from 'src/utils/event';
import CreateOpusModal from '../Menu/CreateOpusModal';
import { CommonModal } from '../ModalPro';
import TopBar from '../TopBar';
import HomeMenu from './HomeMenu';
import styles from './index.module.less';

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { userId } = useRouterParams();
  const { t } = useTranslation();
  const { data: userInfoDetail, mutate: mutateData } =
    useUserHomeDetailReq(userId);

  const { data: currLoginUserInfo } = useUserInfo();
  /** hook */
  const [family, setFamily] = useState('');
  const lang = localStorage.getItem('lang') || 'en';
  const [open, setOpen] = useState<boolean>(false);

  const [openCreateOpus, setOpenCreateOpus] = useState<boolean>(false);

  /** 存储数据 */
  useEffect(() => {
    if (lang === 'en') {
      setFamily('Maven Pro');
    } else {
      setFamily('Noto Sans SC');
    }
  }, [lang]);

  const handleCancelCallback = () => {
    setOpen(false);
  };

  const handleCreateOpusCancelCallback = () => {
    setOpenCreateOpus(false);
  };
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
  const handelOpen = (type: number) => {
    if (type === 2) {
      setOpen(true);
    }
  };
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
              <TopBar />
            </div>
            <div
              className="flex"
              style={{
                height: 'calc(100% - 63px)',
                overflow: 'hidden',
              }}
            >
              <div className={styles.menu}>
                <HomeMenu
                  userInfoDetail={userInfoDetail!}
                  mutateData={mutateData}
                  handelClose={handelOpen}
                />
              </div>

              <div
                className="flex-1 mx-[auto]"
                ref={scrollRef}
                style={{
                  overflowY: 'auto',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                <div className="w-[full] px-[40px] h-[230px] my-[20px] relative">
                  {userInfoDetail?.coverUrl !== '' &&
                  userInfoDetail?.coverUrl ? (
                    <img
                      src={userInfoDetail?.coverUrl}
                      className="rounded-[10px]"
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage:
                          'linear-gradient(to bottom, rgba(255, 255, 255, 0) 32%, #fff 103%)',
                      }}
                    />
                  ) : (
                    <div className={styles.defaultBanner}></div>
                  )}

                  {userInfoDetail?.canEdit && (
                    <div className="absolute top-[20px] right-[60px] rounded-[50%] cursor-pointer bg-[#f3f3f3] w-[35px] h-[35px] flex items-center justify-center">
                      <EditIcon
                        onClick={() => {
                          handelOpen(2);
                        }}
                      />
                    </div>
                  )}
                </div>

                {children}

                <div
                  onClick={() => {
                    if (!currLoginUserInfo) {
                      publish('showLoginView');
                      return;
                    }
                    router.push(`/create?cburl=${router.asPath}`);
                  }}
                  className="flex items-center absolute top-[200px] right-[60px] rounded-full  border border-1 border-[#484848] bg-[#fff] hover:bg-[#eee] cursor-pointer"
                >
                  <div className="py-[10px] px-[15px] flex text-first items-center ">
                    <PlusIcon className="text-first mr-[6px]"></PlusIcon>{' '}
                    {t('clientUI.startCreating.name')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommonModal
        open={open}
        handleCancelCallback={handleCancelCallback}
        title={t('clientUI.personal.name')}
      >
        <UserSetting mutateData={mutateData} />
      </CommonModal>

      <CreateOpusModal
        open={openCreateOpus}
        handleCancelCallback={handleCreateOpusCancelCallback}
      ></CreateOpusModal>
    </div>
  );
};
export default UserLayout;
