import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { workCancelSubmit } from 'src/api/work';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
} from 'src/components/common';
import {
  OpusInfoForSubmission,
  creatorCenterSubmissionListReq,
} from 'src/data/use-user-creator-center-submission-list';
import SubmissionItem from './SubmissionItem';

const pageSize = 6;

export default function SubmissionList({
  keyword,
  isFirst,
}: {
  keyword: string;
  isFirst: boolean;
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<any>(null);
  const reqStateRef = useRef(true);
  const [dataList, setDataList] = useState<OpusInfoForSubmission[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    creatorCenterSubmissionListReq({
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
      <>
        <div className="flex flex-col h-full ">
          <div className="flex w-full text-[16px] text-[#a9a9a9] ">
            <div className="flex-[6]">
              {t('clientUI.creatorCenter.post')} ({total})
            </div>
            <div className="flex-[3]">
              {t('clientUI.creatorCenter.submittedSpace')}
            </div>
            <div className="flex-[2]">{t('clientUI.creatorCenter.status')}</div>
            <div className="flex-[2]">
              {t('clientUI.creatorCenter.submissionDate')}
            </div>
            <div className="flex-[3]"></div>
          </div>
          <div
            className="overflow-y-auto w-full"
            id="scrollableDiv"
            ref={scrollRef}
          >
            <InfiniteScroll
              dataLength={dataList.length}
              next={loadMoreData}
              hasMore={!isReachingEnd}
              loader={<div />}
              scrollableTarget="scrollableDiv"
              className="w-full"
            >
              {dataList.map((item, _) => {
                return (
                  <div key={item.uuid} className="">
                    <SubmissionItem
                      item={item}
                      onCancelSubmit={() => {
                        onCancelSubmit(item.id!);
                      }}
                    />
                  </div>
                );
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
      </>
    );
  }

  async function onCancelSubmit(id: number) {
    if (reqStateRef.current === false) {
      return;
    }
    reqStateRef.current = false;
    let res = await workCancelSubmit({ id: id });
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
