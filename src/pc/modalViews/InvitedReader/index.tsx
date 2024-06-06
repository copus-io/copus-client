import Link from 'next/link';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { workDeleteReader } from 'src/api/work';
import { ReactComponent as PlusIcon } from 'src/assets/media/svg2/icon-plus.svg';
import { userFace } from 'src/components/common';
import {
  OpusInfoForPublished,
  useOpusInvitedReaders,
} from 'src/data/use-user-creator-center-published-list';
import UserSimpleInfo from 'src/data/user-simpleInfo-model';
import { publish } from 'src/utils/event';

interface InvitedReaderProps {
  opus: OpusInfoForPublished;
}

export default function InvitedReader({ opus }: InvitedReaderProps) {
  const [containerRef, setContainerRef] = useState<any>();
  const [fresh, setFresh] = useState(0);
  const [currId, setCurrId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<UserSimpleInfo[]>([]);
  const { data, size, total, setSize, mutate } = useOpusInvitedReaders(
    {
      pageSize: 8,
    },
    opus.id!
  );

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || dataList.length === total;
  const loadMoreData = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    setSize(1);
    mutate();
  }, []);

  useEffect(() => {
    if (data) {
      setDataList(([] as UserSimpleInfo[]).concat(...data));
    }
  }, [data]);

  return (
    <div className="pt-[30px] pl-[30px] pb-[20px] font-[500]">
      <div className="font-[600] mb-[20px] flex justify-between pr-[30px]">
        <div className="text-[25px] ">Invited members of {opus.title}</div>
        <div
          onClick={() => {
            publish('InvitedReader_showInviteNewReader', { info: opus });
          }}
          className="flex items-center gap-[6px] cursor-pointer"
        >
          <PlusIcon />
          <div className="text-[14px] ">Invite new members</div>
        </div>
      </div>
      <div
        className="h-[calc(75vh-150px)] overflow-y-auto w-full pr-[10px]"
        ref={(node) => {
          if (node !== null) {
            setContainerRef(node);
          }
        }}
      >
        {containerRef && (
          <InfiniteScroll
            key="invitedReaders"
            next={loadMoreData}
            dataLength={dataList.length}
            hasMore={!isReachingEnd}
            scrollableTarget={containerRef}
            loader={<div />}
          >
            {dataList.map((item, _) => {
              return (
                <div
                  key={item.id}
                  className="px-[20px] py-[30px] border-b border-[#e0e0e0] flex items-center justify-between"
                >
                  <Link
                    className="flex items-center gap-[15px] text-[16px]"
                    href={'user/' + item.namespace}
                    target="_blank"
                  >
                    {userFace(item.faceUrl)}
                    {item.username}
                  </Link>
                  <div
                    onClick={async () => {
                      if (loading) return;

                      setCurrId(item.id);

                      setLoading(true);
                      const res = await workDeleteReader({ id: item.id });
                      if (res.data.status === 1) {
                        const newArr = dataList.filter(
                          (value) => value.id !== item.id
                        );
                        setDataList(newArr);
                        mutate();
                        setFresh(fresh + 1);
                      }
                      setLoading(false);
                    }}
                    className="border rounded-full px-[15px] py-[5px] cursor-pointer"
                  >
                    Remove access
                    {loading && currId === item.id && (
                      <i className="fa fa-circle-o-notch fa-spin ml-[4px]" />
                    )}
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
