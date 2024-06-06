import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { confirmInviteSpace } from 'src/api/userSpace';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as MemberIcon } from 'src/assets/media/svg2/icon-home-member.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  spaceLogo,
  userFace,
} from 'src/components/common';
import {
  SpaceInviteInfo,
  creatorCenterInvitingListReq,
} from 'src/data/use-user-creator-center-spaces-list';
import { floorFixedNumber } from 'src/utils/common';

const pageSize = 5;

export default function InviteSpaces({
  isFirst,
  keyword,
}: {
  keyword: string;
  isFirst: boolean;
}) {
  const { t } = useTranslation();

  const reqStateRef = useRef(true);
  const scrollRef = useRef<any>(null);
  const [dataList, setDataList] = useState<SpaceInviteInfo[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    creatorCenterInvitingListReq({
      pageSize: pageSize,
      pageIndex: pageIndex,
      keyword: keyword ? keyword : '',
    }).then((resp) => {
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
  }, [pageIndex, freshData, keyword]);

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  const loadMoreData = () => {
    if (!isReachingEnd) {
      setPageIndex(pageIndex + 1);
    }
  };

  if (isLoading) {
    return <>{loadingView()}</>;
  }

  return <>{isEmpty ? emptyDataTips() : dataView()};</>;

  function dataView() {
    return (
      <div className="flex flex-col h-full ">
        <div
          className="overflow-y-auto w-full"
          id="scrollableInviteSpacesDiv"
          ref={scrollRef}
        >
          <InfiniteScroll
            dataLength={dataList.length}
            next={loadMoreData}
            hasMore={!isReachingEnd}
            loader={<div />}
            scrollableTarget="scrollableInviteSpacesDiv"
            className="w-full"
          >
            {dataList.map((item, _) => {
              return itemDiv(item);
            })}
          </InfiniteScroll>

          {dataList.length > 0 &&
            listViewLoadMore(
              !isReachingEnd,
              isReachingEnd,
              setPageIndex,
              pageIndex,
              t
            )}
        </div>
      </div>
    );
  }

  function itemDiv(item: SpaceInviteInfo) {
    return (
      <div key={item.id} className="flex flex-col p-[20px]">
        <div className="flex items-center gap-[10px] text-[#484848] text-[14px] mb-[20px]">
          <div
            onClick={() => {
              window.open('user/' + item.userInfo?.namespace!, 'blank');
            }}
            className="flex items-center  gap-[8px] cursor-pointer hover:underline"
          >
            {userFace(
              item.userInfo?.faceUrl,
              'w-[31px] h-[31px]',
              'w-[20px] h-[20px]'
            )}
            <div className="font-medium">{item.userInfo?.username}</div>
          </div>
          <div className="font-normal">invited you to join:</div>
        </div>

        <div className="flex flex-col pl-[40px] pr-[80px] gap-[20px] ">
          <div
            onClick={() => {
              window.open(item.spaceInfo?.namespace!, 'blank');
            }}
            className="flex gap-[10px] items-center  cursor-pointer w-[280px] border rounded-[15px] border-[#e0e0e0] py-[15px] px-[20px]"
          >
            {spaceLogo(
              item.spaceInfo?.logoUrl,
              item.spaceInfo?.title,
              50,
              'text-[25px]'
            )}
            <div>
              <div className="flex  items-center w-full mb-[10px]">
                <span className="text-[20px] line-clamp-1 text-left font-medium text-[#231f20] leading-[23px]">
                  {item.spaceInfo?.title}
                </span>
              </div>

              <div className="flex  items-center gap-[15px] text-[14px] text-[#696969]">
                <div className="flex items-center justify-center gap-[5px]">
                  <StreamIcon className="w-[15px] h-[17px]" />
                  {floorFixedNumber(item.spaceInfo?.rewardAmount || 0, 2)}
                </div>

                <div className="flex items-center justify-center gap-[5px] ">
                  <MemberIcon className="w-[15px] h-[17px]" />
                  {item.spaceInfo?.userCount || 0}
                </div>

                <div className="flex items-center justify-center gap-[5px]">
                  <PostIcon className="w-[15px] h-[17px]" />
                  {floorFixedNumber(item.spaceInfo?.downstreamCount || 0, 0)}
                </div>
              </div>
            </div>
          </div>

          {item.message ?? <div className="text-[16px]">{item.message}</div>}

          <div className="flex">
            <div
              onClick={() => {
                onConfirmInviteSpace(item.id, 10);
              }}
              className="bg-[#000] text-[#fff] py-[10px] px-[20px] rounded-[50px] border border-[#696969]  mr-[20px] cursor-pointer hover:shadow-hover"
            >
              {t('clientUI.accept')}
            </div>
            <div
              onClick={() => {
                onConfirmInviteSpace(item.id, 20);
              }}
              className="py-[10px] px-[20px] rounded-[50px] border border-[#696969] cursor-pointer hover:shadow-hover"
            >
              {t('clientUI.decline')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function onConfirmInviteSpace(id: number, currState: number) {
    if (reqStateRef.current === false) {
      return;
    }
    reqStateRef.current = false;
    const res = await confirmInviteSpace({
      id: id,
      currState: currState,
    });
    if (res.data.status === 1) {
      const newArr = dataList.filter((value) => value.id !== id);
      setDataList(newArr);
      let leftTotal = total - 1;
      setTotal(leftTotal);
      if (newArr.length < pageSize && leftTotal > newArr.length) {
        setFreshData(freshData + 1);
      }
    }
    reqStateRef.current = true;
  }
}
