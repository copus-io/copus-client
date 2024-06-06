import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { removeInvited } from 'src/api/user';
import Search from 'src/components/Search';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  userFace,
} from 'src/components/common';
import { userInvitedToSpacePageReq } from 'src/data/use-space-invited-user-list';
import UserSimpleInfo from 'src/data/user-simpleInfo-model';

const pageSize = 6;

const PrivateSpaceInvitedMembers = ({ spaceId }: { spaceId: string }) => {
  const [keyword, setKeyword] = useState('');
  const [containerRef, setContainerRef] = useState<any>();

  const [actionLoading, setActionLoading] = useState(false);
  const [currItem, setCurrItem] = useState<UserSimpleInfo>();
  const [dataList, setDataList] = useState<UserSimpleInfo[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    userInvitedToSpacePageReq(
      {
        pageSize: pageSize,
        pageIndex: pageIndex,
        keyword: keyword ? keyword : '',
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
  }, [pageIndex, freshData, keyword]);

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  const loadMoreData = () => {
    setPageIndex(pageIndex + 1);
  };

  const onChangeKeyword = useCallback((value: any) => {
    setKeyword(value);
    setPageIndex(1);
    setIsLoading(true);
  }, []);

  async function onClickBtn(item: UserSimpleInfo) {
    if (actionLoading) return;

    setCurrItem(item);

    setActionLoading(true);
    const res = await removeInvited(item.id!, spaceId);
    if (res.data.status === 1) {
      const newArr = dataList.filter((value) => value.id !== item.id!);
      setDataList(newArr);
      let leftTotal = total - 1;
      setTotal(leftTotal);
      if (newArr.length < pageSize && leftTotal > newArr.length) {
        setFreshData(freshData + 1);
      }
    }
    setActionLoading(false);
  }

  return (
    <div className="w-[100%] ">
      <Search
        style={{
          background: '#f3f3f3',
          borderRadius: '100px',
          padding: '0px 20px',
        }}
        onChange={onChangeKeyword}
      />
      {dataListView()}
    </div>
  );

  function dataListView() {
    if (isLoading) {
      return <div className="h-[calc(52vh)]">{loadingView()}</div>;
    }
    if (isEmpty) {
      return emptyDataTips();
    }

    return (
      <div
        className="overflow-y-auto h-[calc(55vh)]"
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
              return itemView(item);
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

  function itemView(item: UserSimpleInfo) {
    return (
      <div
        key={item.id}
        className="flex h-[100px] items-center px-[20px] justify-between border-b-[1px] border-border"
      >
        <div className="flex items-center ">
          {userFace(item.faceUrl, 'w-[40px] h-[40px]')}
          <div className="ml-[15px]">{item.username}</div>
        </div>
        <div
          onClick={() => {
            onClickBtn(item);
          }}
          className="px-[15px] py-[5px] rounded-full cursor-pointer text-first border border-[1px] border-[#a9a9a9]"
        >
          Remove access
          {actionLoading && currItem!.id === item.id && (
            <span className="ml-2">
              <i className="fa fa-circle-o-notch fa-spin" />
            </span>
          )}
        </div>
      </div>
    );
  }
};

export default PrivateSpaceInvitedMembers;
