import { Divider, Drawer } from 'antd';
import clsx from 'clsx';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ReactComponent as MoreIcon } from 'src/assets/media/svg2/icon-drawer-more.svg';
import CreateOpusModal from 'src/components/Menu/CreateOpusModal';
import { OpusInfo } from 'src/data/use-work-detail';
import useRouterParams from 'src/hooks/use-router-params';
import { subscribe } from 'src/utils/event';
import Article from './Article';
import Branches from './Branchers';
import Comment from './Comment';
import WorkSide from './DrawerSide';
import Photos from './Photos';
import WorkBottom from './WorkBottom';
import StreamCreatorModal from './WorkBottom/StreamCreatorModal';
import styles from './index.module.less';

const WorkDetail = ({ articleData }: { articleData: OpusInfo }) => {
  const { workUuid } = useRouterParams();
  const [open, setOpen] = useState(false);

  const [openOpusModal, setOpenOpusModal] = useState(false);
  const [visibleStreamModal, setVisibleStreamModal] = useState(false); // 打赏弹框
  const handleCancelCallback = () => {
    setOpenOpusModal(false);
  };
  const handleCloseModal = () => {
    setVisibleStreamModal(false);
  };

  const [commentCount, setCommentCount] = useState(0);
  //
  useEffect(() => {
    console.log('opusData', articleData);
    setCommentCount(articleData?.commentCount ?? 0);
    const dom: any = document.getElementById('scrollableDiv');
    if (dom) {
      dom.scrollTop = 0;
    }
  }, [articleData]);
  useEffect(() => {
    subscribe('open_work_createOpusModal', () => {
      // setOpenOpusModal(true);
      router.push(`/create?&cburl=${router.asPath}`);
    });

    subscribe('open_work_streamModal', () => {
      setVisibleStreamModal(true);
    });
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  //
  const getComponent = () => {
    return <Article articleData={articleData}></Article>;

    switch (articleData?.opusType) {
      case 10:
        return <Article articleData={articleData}></Article>;
      case 20:
        return <Photos articleData={articleData}></Photos>;
      case 30:
        return <Article articleData={articleData}></Article>;
      case 40:
        return <Article articleData={articleData}></Article>;
      default:
        return <></>;
    }
  };
  return (
    <div ref={ref1} className={clsx('h-full flex relative !select-auto')}>
      <div
        className="absolute transition-opacity ease-in-out delay-150 right-[200px] shadow-hover top-[140px] w-[40px] h-[40px] flex items-center justify-center bg-[#f3f3f3] border border-[#e0e0e0] rounded-[40px] cursor-pointer  z-[1]"
        style={{ opacity: open ? 0 : 1 }}
        onClick={showDrawer}
      >
        <MoreIcon></MoreIcon>
      </div>
      <div
        className="flex w-full justify-center   overflow-y-auto"
        ref={ref2}
        id="scrollableDiv"
      >
        <div
          className={clsx(
            'mx-[120px] h-full  w-[1250px]  pb-[50px] !select-text',
            styles.hide1000
          )}
        >
          {getComponent()}
          <WorkBottom
            articleData={articleData}
            commentCount={commentCount}
          ></WorkBottom>
          <Divider className="bg-[#e0e0e0] !my-[0px]"></Divider>
          {articleData && (
            <Comment
              opusInfo={articleData!}
              addOrSubCommentCount={(count) => {
                setCommentCount(commentCount + 1);
              }}
            ></Comment>
          )}
          <Divider className="bg-[#e0e0e0] !my-[0px]"></Divider>

          <Branches opusId={articleData?.id}></Branches>
          <div className="h-[50px]"></div>
        </div>
      </div>

      <Drawer
        autoFocus={false}
        placement="right"
        closable={false}
        open={open}
        mask={false}
        getContainer={false}
        destroyOnClose
        width={330}
        styles={{
          content: {
            borderLeft: ' 1px solid #e0e0e0',
          },
          body: { padding: 0 },
          wrapper: {
            boxShadow: 'none',
          },
        }}
      >
        <WorkSide sideData={articleData} onClose={onClose}></WorkSide>
      </Drawer>

      <CreateOpusModal
        open={openOpusModal}
        handleCancelCallback={handleCancelCallback}
      ></CreateOpusModal>

      <StreamCreatorModal
        open={visibleStreamModal}
        onCancel={handleCloseModal}
        opusInfo={articleData}
      />
    </div>
  );
};
export default WorkDetail;
