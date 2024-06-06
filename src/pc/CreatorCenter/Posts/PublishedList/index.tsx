import { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommonModal } from 'src/components/ModalPro';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
} from 'src/components/common';
import useCreatorCenterPublishedListReq, {
  OpusInfoForPublished,
} from 'src/data/use-user-creator-center-published-list';
import InvitedReader from 'src/pc/modalViews/InvitedReader';
import SubmitMoreSpaces from 'src/pc/modalViews/SubmitMoreSpaces';
import WorkInSpaceList from 'src/pc/modalViews/WorkInSpaceList';
import WorkSharePrivate from 'src/pc/modalViews/WorkSharePrivate';
import { subscribe } from 'src/utils/event';
import PublishedItem from './PublishedItem';

const PublishedList = (props: { keyword: string }) => {
  const { t } = useTranslation();

  const { keyword } = props;

  const [openInvitedReaderList, setOpenInvitedReaderList] = useState(false);
  const [openInviteNewReader, setOpenInviteNewReader] = useState(false);
  const [openSpaceList, setOpenSpaceList] = useState(false);
  const [openSubmitMoreSpace, setOpenSubmitMoreSpace] = useState(false);
  const [currOpus, setCurrOpus] = useState<OpusInfoForPublished>();

  const [publishedList, setPublishedList] = useState<OpusInfoForPublished[]>(
    []
  );

  const scrollRef = useRef<any>(null);
  const { data, size, isLoading, total, setSize, error, mutate } =
    useCreatorCenterPublishedListReq({
      pageSize: 10,
      keyword: keyword ? keyword : '',
    });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || publishedList.length === total;
  const loadMoreData = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    setSize(1);
  }, []);

  useEffect(() => {
    subscribe('InvitedReader_showInviteNewReader', (event: CustomEvent) => {
      onReceiveMsg(event.detail.info);
    });
  }, []);

  function onReceiveMsg(data?: any) {
    setOpenInvitedReaderList(false);
    setCurrOpus(data);
    setOpenInviteNewReader(true);
  }

  useEffect(() => {
    if (data) {
      setPublishedList(([] as OpusInfoForPublished[]).concat(...data));
    }
  }, [data]);

  if (isLoading) {
    return <>{loadingView()}</>;
  }

  return <>{isEmpty ? emptyDataTips() : dataView()};</>;

  function dataView() {
    return (
      <div className="flex flex-col h-full ">
        <div className="flex w-full justify-between pr-[24px]">
          <div className=" text-[16px] text-[#a9a9a9] mr-[92px]">
            {t('clientUI.creatorCenter.post')} ({total})
          </div>
          <div className="flex text-[16px] text-[#a9a9a9] w-[730px]">
            <div className="w-[192px] mr-[92px]">
              {t('clientUI.creatorCenter.spaces')}
            </div>
            <div className=" w-[110px] mr-[92px]">
              {t('clientUI.creatorCenter.visibility')}
            </div>
            <div className=" w-[110px] mr-[92px]">
              {t('clientUI.creatorCenter.publishedDate')}
            </div>
            <div className=" w-[40px]"></div>
          </div>
        </div>
        <div
          className="overflow-y-auto w-full  pr-[10px]"
          id="scrollablePublishedListDiv"
          ref={scrollRef}
        >
          <InfiniteScroll
            dataLength={publishedList.length}
            next={loadMoreData}
            hasMore={!isReachingEnd}
            loader={<div />}
            scrollableTarget="scrollablePublishedListDiv"
            className="w-full"
          >
            {publishedList.map((item, _) => {
              return (
                <div key={item.uuid} className="">
                  <PublishedItem
                    item={item}
                    changeAccessLevelCallback={() => {
                      mutate();
                    }}
                    showInvitedReaderList={() => {
                      setOpenInvitedReaderList(true);
                      setCurrOpus(item);
                    }}
                    showSubmitMoreSpace={() => {
                      setOpenSubmitMoreSpace(true);
                      setCurrOpus(item);
                    }}
                    showSpaceList={() => {
                      setOpenSpaceList(true);
                      setCurrOpus(item);
                    }}
                  />
                </div>
              );
            })}
          </InfiniteScroll>
          {publishedList.length > 0 &&
            listViewLoadMore(isLoadingMore, isReachingEnd, setSize, size, t)}
        </div>

        {openInvitedReaderList && (
          <CommonModal
            handleCancelCallback={() => {
              setOpenInvitedReaderList(false);
            }}
          >
            <InvitedReader opus={currOpus!} />
          </CommonModal>
        )}

        {openSubmitMoreSpace && (
          <CommonModal
            handleCancelCallback={() => {
              setOpenSubmitMoreSpace(false);
            }}
          >
            <SubmitMoreSpaces opusId={currOpus!.id} uuid={currOpus!.uuid!} />
          </CommonModal>
        )}

        {openSpaceList && (
          <CommonModal
            handleCancelCallback={() => {
              setOpenSpaceList(false);
            }}
          >
            <WorkInSpaceList workInfo={currOpus!} mutate={mutate} />
          </CommonModal>
        )}

        {openInviteNewReader && (
          <CommonModal
            handleCancelCallback={() => {
              setOpenInviteNewReader(false);
            }}
          >
            <WorkSharePrivate
              opus={currOpus}
              close={() => {
                setOpenInviteNewReader(false);
              }}
              dataCallBack={(emails: string[], userIds: number[]) => {
                console.info(emails, userIds);
              }}
            />
          </CommonModal>
        )}
      </div>
    );
  }
};

export default PublishedList;
