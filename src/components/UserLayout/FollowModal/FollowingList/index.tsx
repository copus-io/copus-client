import { message } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { onClickUnFollowReq } from 'src/api/userSpace';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/ic-stream.svg';
import Search from 'src/components/Search';
import { emptyDataTips, userFace } from 'src/components/common';
import { usePageUserFollowings } from 'src/data/use-userHome-detail';
import UserSimpleInfo from 'src/data/user-simpleInfo-model';
import useRouterParams from 'src/hooks/use-router-params';
import { floorFixedNumber } from 'src/utils/common';

export default function FollowingList({
  isFirst = true,
  canEdit = false,
}: {
  isFirst?: boolean;
  canEdit: boolean;
}) {
  const { userId } = useRouterParams();
  const [containerRef, setContainerRef] = useState<any>();

  const [keyword, setKeyword] = useState('');
  function onKeywordChange(keyword: string) {
    setKeyword(keyword);
  }

  const [dataList, setDataList] = useState<UserSimpleInfo[]>([]);
  const { data, size, total, setSize } = usePageUserFollowings(
    {
      pageSize: 6,
      keyword: keyword,
    },
    userId
  );

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || dataList.length === total;
  const loadMoreData = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    if (data) {
      setDataList(([] as UserSimpleInfo[]).concat(...data));
    }
  }, [data]);

  useEffect(() => {
    setSize(1);
  }, [isFirst]);

  return (
    <div className="h-full">
      <Search
        isDebounce={true}
        searchClassName="mt-[15px]  !border-x-[1px] !border-[#f3f3f3] !h-[42px]  !rounded-[50px] !pl-[10px] !bg-[#f3f3f3]"
        onChange={onKeywordChange}
      ></Search>

      {isEmpty ? emptyDataTips() : dataView()}
    </div>
  );

  function dataView() {
    if (dataList.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Loading
        </div>
      );
    }

    return (
      <div
        className="max-h-[calc(63vh)] pt-[10px] overflow-y-auto"
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
      </div>
    );
  }

  function itemDiv(item: UserSimpleInfo) {
    return (
      <div
        key={item.id}
        className="flex items-center justify-between hover:bg-[#eee] py-[30px] mr-[30px]"
      >
        <Link
          className="flex items-center"
          href={'/user/' + item.namespace}
          target="_blank"
        >
          {userFace(item.faceUrl)}
          <div className="flex flex-col mx-[10px]">
            <p className="text-[20px] text-first">{item.username}</p>
            <div className="flex items-center">
              <PostIcon />
              <span className="text-[14px] ml-[5px] text-first">
                {item.opusCount}
              </span>

              <StreamIcon className="ml-[10px]" />
              <span className="text-[14px] ml-[5px] text-first">
                {floorFixedNumber(item.tokenAmount || 0, 2)}
              </span>
            </div>
          </div>
        </Link>

        {canEdit ? (
          <button
            onClick={() => {
              onClickUnFollow(item.id);
            }}
            className="px-[15px] py-[5px] rounded-full border border-solid border-[#696969] text-[#696969] font-[500] text-[14px] bg-white mr-[5px]"
          >
            Unfollow
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  }

  async function onClickUnFollow(userId: number) {
    try {
      const res = await onClickUnFollowReq(userId);
      if (res.data.status) {
        const newArr = dataList.filter((value) => value.id !== userId);
        setDataList(newArr);
        message.success('Success!');
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
    }
  }
}
