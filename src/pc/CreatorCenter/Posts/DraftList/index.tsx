import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteDraft } from 'src/api/work';
import { ReactComponent as IconDelete } from 'src/assets/media/svg2/ic-delete.svg';
import { ReactComponent as IconEdit } from 'src/assets/media/svg2/ic-edit.svg';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  postCover,
} from 'src/components/common';
import {
  OpusInfoForDraft,
  creatorCenterDraftListReq,
} from 'src/data/use-user-creator-center-draft-list';

import { formatTimestamp } from 'src/utils/common';

export default function DraftList({
  keyword,
  isFirst,
}: {
  keyword: string;
  isFirst: boolean;
}) {
  const { t } = useTranslation();

  const router = useRouter();
  const reqStateRef = useRef(true);
  const scrollRef = useRef<any>(null);
  const [dataList, setDataList] = useState<OpusInfoForDraft[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    creatorCenterDraftListReq({
      pageSize: 8,
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
      <>
        <div className="flex flex-col h-full ">
          <div className="flex w-full text-[16px] text-[#a9a9a9] pb-[10px]">
            <div className="flex-[3]">
              {t('clientUI.creatorCenter.post')} ({total})
            </div>
            <div className="flex-[2]">
              {t('clientUI.creatorCenter.savedDate')}
            </div>
            <div className="flex-[1]"></div>
          </div>
          <div
            className="overflow-y-auto w-full"
            id="scrollableDraftDiv"
            ref={scrollRef}
          >
            <InfiniteScroll
              dataLength={dataList.length}
              next={loadMoreData}
              hasMore={!isReachingEnd}
              loader={<div />}
              scrollableTarget="scrollableDraftDiv"
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
      </>
    );
  }

  function itemDiv(item: OpusInfoForDraft) {
    return (
      <div key={item.id} className="py-[30px] flex w-full items-center ">
        <Link
          href={`/create?uuid=${item?.uuid}&cburl=${router.asPath}`}
          className="flex-[3] flex items-center gap-[12px]"
        >
          {postCover(item.coverUrl, item.title, 70, 'text-[50px]')}
          <div className="text-[20px] line-clamp-1 text-left font-medium text-[#231f20] leading-[23px]">
            {item.title}
          </div>
        </Link>
        <div className="flex-[2]">
          {item?.editTime && formatTimestamp(item.editTime as any)}
        </div>
        <div className="flex-[1] flex items-center gap-[20px]">
          <div
            onClick={() => {
              toEdit(item);
            }}
            className="cursor-pointer  flex w-[35px] h-[35px] items-center justify-center border-[1px] rounded-full"
          >
            <IconEdit></IconEdit>
          </div>
          <div
            onClick={() => {
              deleteDraftConfirm(item);
            }}
            className="cursor-pointer flex w-[35px] h-[35px] items-center justify-center border-[1px] rounded-full"
          >
            <IconDelete></IconDelete>
          </div>
        </div>
      </div>
    );
  }

  function toEdit(item: OpusInfoForDraft) {
    router.push(`/create?uuid=${item?.uuid}&cburl=${router.asPath}`);
    return;
  }

  function deleteDraftConfirm(item: OpusInfoForDraft) {
    Modal.confirm({
      title: 'Are you sure to delete this draft: ' + item.title,
      icon: <ExclamationCircleFilled />,
      okText: t('clientUI.yes'),
      getContainer: '.cascade_con',
      okType: 'danger',
      cancelText: t('clientUI.no'),
      onOk: async () => {
        toDelete(item);
      },
    });
  }

  async function toDelete(item: OpusInfoForDraft) {
    if (reqStateRef.current === false) {
      return;
    }
    reqStateRef.current = false;
    const res = await deleteDraft({
      id: item.id!,
    });
    if (res.data.status === 1) {
      const newArr = dataList.filter((value) => value !== item);
      setDataList(newArr);
      let leftTotal = total - 1;
      setTotal(leftTotal);
      if (newArr.length < 8 && leftTotal > newArr.length) {
        setFreshData(freshData + 1);
      }
    }
    reqStateRef.current = true;
  }
}
