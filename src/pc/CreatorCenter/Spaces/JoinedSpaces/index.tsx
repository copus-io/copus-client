import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { onJoinSpaceReq } from 'src/api/userSpace';
import { ReactComponent as BackIcon } from 'src/assets/media/svg2/ic-back.svg';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as MemberIcon } from 'src/assets/media/svg2/icon-home-member.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  spaceLogo,
} from 'src/components/common';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import { creatorCenterMyJoinedSpaceListReq } from 'src/data/use-user-creator-center-spaces-list';
import { floorFixedNumber } from 'src/utils/common';

const pageSize = 8;

export default function JoinedSpaces({
  isFirst,
  keyword,
}: {
  keyword: string;
  isFirst: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const scrollRef = useRef<any>(null);
  const [isActionLoading, setIsActonLoading] = useState(false);

  const [dataList, setDataList] = useState<SpaceMetaInfo[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    creatorCenterMyJoinedSpaceListReq({
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

  return <>{isEmpty ? emptyDataTips() : dataView()}</>;

  function dataView() {
    return (
      <div className="flex flex-col h-full ">
        <div
          className="overflow-y-auto w-full"
          id="scrollableJoinedSpacesDiv"
          ref={scrollRef}
        >
          <InfiniteScroll
            dataLength={dataList.length}
            next={loadMoreData}
            hasMore={!isReachingEnd}
            loader={<div />}
            scrollableTarget="scrollableJoinedSpacesDiv"
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

  function itemDiv(item: SpaceMetaInfo) {
    return (
      <div key={item.id} className="flex justify-between hover:bg-[#eee]">
        <div
          onClick={() => {
            router.push(item.namespace!);
          }}
          className="flex gap-[10px] items-center py-[30px] cursor-pointer"
        >
          {spaceLogo(item.logoUrl, item.title, 70, 'text-[40px]')}
          <div>
            <div className="flex  items-center w-full mb-[10px]">
              <span className="text-[20px] line-clamp-1 text-left font-medium text-[#231f20] leading-[23px]">
                {item?.title}
              </span>
            </div>

            <div className="flex  items-center gap-[15px] text-[14px] text-[#696969]">
              <div className="flex items-center justify-center gap-[5px]">
                <StreamIcon className="w-[15px] h-[17px]" />
                {floorFixedNumber(item?.rewardAmount || 0, 2)}
              </div>

              <div className="flex items-center justify-center gap-[5px] ">
                <MemberIcon className="w-[15px] h-[17px]" />
                {item?.userCount || 0}
              </div>

              <div className="flex items-center justify-center gap-[5px]">
                <PostIcon className="w-[15px] h-[17px]" />
                {floorFixedNumber(item?.downstreamCount || 0, 0)}
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={async () => {
            if (isActionLoading) {
              return;
            }
            setIsActonLoading(true);
            const res = await onJoinSpaceReq(item.namespace!);
            if (res.data.status === 1) {
              const newArr = dataList.filter((value) => value.id !== item.id);
              setDataList(newArr);
              let leftTotal = total - 1;
              setTotal(leftTotal);
              if (newArr.length < pageSize && leftTotal > newArr.length) {
                setFreshData(freshData + 1);
              }
            }
            setIsActonLoading(false);
          }}
          className="flex justify-center items-center cursor-pointer mr-[10px]"
        >
          <div className="gap-[10px] py-[5px] px-[10px] rounded-[50px] border border-[#696969]  flex justify-center items-center">
            <BackIcon />
            <div>
              {t('clientUI.creatorCenter.leave')}
              {isActionLoading && (
                <i className="fa fa-circle-o-notch fa-spin ml-[4px]" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
