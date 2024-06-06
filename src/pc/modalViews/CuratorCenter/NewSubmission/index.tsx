import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  handleSubmissionToSpace,
  readTheSubmissionToSpace,
} from 'src/api/userSpace';
import { ReactComponent as BranchIcon } from 'src/assets/media/svg2/icon-home-branch1.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as ViewIcon } from 'src/assets/media/svg2/icon-home-view1.svg';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  userFace,
} from 'src/components/common';
import {
  OpusSubmitSpaceInfo,
  newSubmissionToSpaceListReq,
} from 'src/data/use-curator-center-list';
import { floorFixedNumber } from 'src/utils/common';
import { publish } from 'src/utils/event';

const pageSize = 6;

export default function NewSubmission({ spaceId }: { spaceId: string }) {
  const { t } = useTranslation();
  const reqStateRef = useRef(true);

  const [dataList, setDataList] = useState<OpusSubmitSpaceInfo[]>([]);
  const [containerRef, setContainerRef] = useState<any>();

  const [fresh, setFresh] = useState(0);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    newSubmissionToSpaceListReq(
      {
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
      spaceId
    ).then((resp) => {
      if (resp) {
        setTotal(resp.totalRecords);

        if (pageIndex === 1) {
          setDataList(resp.data);
        } else {
          setDataList(dataList.concat(...resp.data));
        }

        if (pageIndex >= resp.pageCount) {
          setIsReachingEnd(true);
        } else {
          setIsReachingEnd(false);
        }
      }
      setIsLoading(false);
    });
  }, [freshData, pageIndex]);

  function loadMoreData() {
    setPageIndex(pageIndex + 1);
  }

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  return dataView();

  function dataView() {
    if (isLoading) {
      return loadingView();
    }

    if (isEmpty) {
      return emptyDataTips();
    }

    return (
      <div
        className="pt-[10px] overflow-y-auto  h-[calc(58vh)]"
        ref={(node) => {
          if (node !== null) {
            setContainerRef(node);
          }
        }}
      >
        {containerRef && (
          <InfiniteScroll
            next={loadMoreData}
            dataLength={dataList.length}
            hasMore={!isReachingEnd}
            scrollableTarget={containerRef}
            loader={<div />}
          >
            {dataList.map((item, _) => {
              return itemDiv(item);
            })}
          </InfiniteScroll>
        )}

        {dataList.length > 0 &&
          listViewLoadMore(
            !isReachingEnd,
            isReachingEnd,
            setPageIndex,
            pageIndex,
            t
          )}
      </div>
    );
  }

  function itemDiv(item: OpusSubmitSpaceInfo) {
    return (
      <div
        key={item.creation?.uuid}
        className="flex px-[5px] py-[15px] flex-col gap-[10px] hover:bg-[#eee] "
      >
        <div
          onClick={() => {
            window.open(`user/${item.creation?.userInfo?.namespace!}`, 'blank');
          }}
          className="flex items-center cursor-pointer hover:underline"
        >
          {item.isRead ? (
            <div className="w-[12px] mr-[10px]"></div>
          ) : (
            <div className="w-[12px] h-[12px] mr-[10px] rounded-full bg-[#f22c00]"></div>
          )}
          {userFace(
            item.creation?.userInfo.faceUrl,
            'w-[21px] h-[21px]',
            'w-[15px] h-[15px]'
          )}
          <div className="ml-[5px]">{item.creation?.userInfo.username}</div>
        </div>
        <div className="flex flex-col ml-[22px] gap-[12px]">
          <div
            onClick={() => {
              console.info(item);
              if (item.isRead === false) {
                readTheSubmissionToSpace({ id: item.id! }, spaceId);
                item.isRead = true;
                setFresh(fresh + 1);
              }
              window.open(`/work/${item.creation?.uuid}`, '_blank');
            }}
            className="cursor-pointer gap-[8px]"
          >
            <div className="font-[600] text-[20px]">{item.creation?.title}</div>
            <div className="flex gap-[14px] items-center mt-[2px] text-[14px] text-[#696969]">
              <div className=" flex items-center justify-center">
                <ViewIcon />
                <span className=" ml-[4px]">
                  {item.creation?.readCount || 0}
                </span>
              </div>

              <div className=" flex items-center justify-center">
                <StreamIcon />
                <span className="text-[14px] text-[#696969]   ml-[4px]">
                  {floorFixedNumber(item.creation?.rewardAmount || 0, 2)}
                </span>
              </div>

              <div className=" flex items-center justify-center">
                <BranchIcon />
                <span className="text-[14px] text-[#696969]   ml-[4px]">
                  {item.creation?.shareCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* message */}
          {item.message ?? <div className="text-[16px]">{item.message}</div>}

          <div className="flex">
            <div
              onClick={() => {
                onConfirmSubmitSpace(item.id!, 10);
              }}
              className="flex items-center cursor-pointer mr-[20px]"
            >
              <div className=" py-[5px] px-[10px] rounded-[50px] border border-[#696969] ">
                {t('clientUI.accept')}
              </div>
            </div>
            <div
              onClick={() => {
                onConfirmSubmitSpace(item.id!, 20);
              }}
              className="flex items-center cursor-pointer"
            >
              <div className=" py-[5px] px-[10px] rounded-[50px] border border-[#696969] ">
                {t('clientUI.decline')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function onConfirmSubmitSpace(id: number, currState: number) {
    if (reqStateRef.current === false) {
      return;
    }
    reqStateRef.current = false;
    const res = await handleSubmissionToSpace(
      { id: id, currState: currState },
      spaceId
    );
    if (res.data.status === 1) {
      const newArr = dataList.filter((value) => value.id !== id);
      setDataList(([] as OpusSubmitSpaceInfo[]).concat(...newArr));
      let leftTotal = total - 1;
      setTotal(leftTotal);
      if (newArr.length < pageSize && leftTotal > newArr.length) {
        setFreshData(freshData + 1);
      }
      if (currState === 10) {
        publish('freshSpaceHomeList');
      }
    }
    reqStateRef.current = true;
  }
}
