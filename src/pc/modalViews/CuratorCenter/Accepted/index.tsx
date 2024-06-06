import { Popover, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { featureOpusForSpace, takenDownFromSpace } from 'src/api/userSpace';
import { opusSetTag } from 'src/api/work';
import { ReactComponent as BranchIcon } from 'src/assets/media/svg2/icon-home-branch1.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as ViewIcon } from 'src/assets/media/svg2/icon-home-view1.svg';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  tagItemView,
} from 'src/components/common';
import { CreationForSpaceHome } from 'src/data/use-creation-list';
import { spaceOpusListReq } from 'src/data/use-space-creation-list';
import useSpaceTagManageReq from 'src/data/use-space-tag-manage';
import { OpusTagInfo } from 'src/data/use-work-detail';
import { floorFixedNumber } from 'src/utils/common';
import { publish } from 'src/utils/event';

const pageSize = 6;

export default function Accepted({ spaceId }: { spaceId: string }) {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<CreationForSpaceHome[]>([]);

  const reqStateRef = useRef(true);
  const [containerRef, setContainerRef] = useState<any>();

  const [fresh, setFresh] = useState(0);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  const [tagAllList, setTagAllList] = useState<OpusTagInfo[]>([]);
  const { data: tagData } = useSpaceTagManageReq(spaceId);
  useEffect(() => {
    setTagAllList(tagData ? ([] as OpusTagInfo[]).concat(...tagData) : []);
  }, [tagData]);

  useEffect(() => {
    spaceOpusListReq(
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

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  function loadMoreData() {
    setPageIndex(pageIndex + 1);
  }

  if (isLoading) {
    return loadingView();
  }

  return <>{isEmpty ? emptyDataTips() : dataView()}</>;

  function dataView() {
    return (
      <div
        className="pt-[10px] overflow-y-auto h-[calc(58vh)]"
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

  function itemDiv(item: CreationForSpaceHome) {
    return (
      <div
        key={item.uuid}
        className="flex px-[10px] py-[15px] flex-col gap-[10px]  "
      >
        <div className="flex items-center cursor-pointer gap-[10px] hover:underline">
          {item.userInfo.faceUrl ? (
            <img
              src={item.userInfo.faceUrl}
              className="rounded-full object-cover object-center h-[21px] w-[21px]"
            />
          ) : (
            ''
          )}
          <div>{item.userInfo.username}</div>
        </div>

        {/* opusInfo */}
        <div
          onClick={() => {
            window.open(`/work/${item.uuid}`, '_blank');
          }}
          className="cursor-pointer gap-[8px]"
        >
          <div className="font-[600] text-[20px] hover:underline">
            {item.title}
          </div>
          <div className="flex gap-[14px] items-center mt-[2px] text-[14px] text-[#696969]">
            <div className=" flex items-center justify-center">
              <ViewIcon />
              <span className=" ml-[4px]">{item?.readCount || 0}</span>
            </div>

            <div className=" flex items-center justify-center">
              <StreamIcon />
              <span className="text-[14px] text-[#696969]   ml-[4px]">
                {floorFixedNumber(item?.rewardAmount || 0, 2)}
              </span>
            </div>

            <div className=" flex items-center justify-center">
              <BranchIcon />
              <span className="text-[14px] text-[#696969]   ml-[4px]">
                {item?.shareCount || 0}
              </span>
            </div>
          </div>
        </div>

        {item.tagInfos && item.tagInfos.length > 0 && (
          <div className="my-[5px] flex gap-[10px]">
            {item.tagInfos.map((tag, _) => {
              return tagItemView(tag);
            })}
          </div>
        )}

        <div className="flex gap-[10px]">
          {tagAllList && (
            <Popover
              placement="bottomLeft"
              color="white"
              arrow={false}
              content={tagSettingView(item)}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className=" py-[5px] px-[15px] rounded-[50px] border border-[#696969] cursor-pointer text-[#231f20] hover:shadow-hover"
              >
                {t('clientUI.curatorCenter.addTag')}
              </div>
            </Popover>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
              feature(item);
            }}
            className="flex justify-center py-[5px] px-[15px] w-[100px] rounded-[50px] border border-[#696969] cursor-pointer  text-[#231f20] hover:shadow-hover"
          >
            {item.isFeatured === true
              ? t('clientUI.curatorCenter.unFeature')
              : t('clientUI.curatorCenter.Feature')}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              takeDown(item.id!);
            }}
            className="flex py-[5px] px-[10px] items-center cursor-pointer text-[#231f20] hover:underline"
          >
            {t('clientUI.curatorCenter.takeDown')}
          </div>
        </div>
      </div>
    );
  }

  function tagSettingView(item: CreationForSpaceHome) {
    return (
      <div className="p-[20px] max-w-[400px]">
        <div className="flex flex-wrap gap-[10px]">
          {tagAllList.map((tag, index) => {
            let existObj = item.tagInfos?.filter(
              (value) => value.id === tag.id
            );
            return (
              <div
                key={index}
                onClick={() => {
                  let newArr = item.tagInfos?.filter(
                    (value) => value.id !== tag.id
                  );
                  if (item.tagInfos?.length === newArr?.length) {
                    if (!item.tagInfos) {
                      item.tagInfos = [];
                    }
                    item.tagInfos?.push(tag);
                  } else {
                    item.tagInfos = newArr;
                  }
                  console.info(item.tagInfos, newArr, tag.id);
                  setTag(item, tag.id);
                  setFresh(fresh + 1);
                }}
                className="cursor-pointer"
              >
                {tagItemView(tag, undefined, existObj === undefined)}
              </div>
            );
          })}
        </div>

        <div className="mt-[20px]">
          {t('clientUI.curatorCenter.addNewTagTips1')}{' '}
          <span
            onClick={() => {
              publish('gotoSpaceSetting');
            }}
            className="underline cursor-pointer"
          >
            {t('clientUI.curatorCenter.addNewTagTips2')}
          </span>
        </div>
      </div>
    );
  }

  async function setTag(item: CreationForSpaceHome, id: number) {
    opusSetTag({ opusId: item.id, tagId: id }, spaceId);
  }

  async function feature(item: CreationForSpaceHome) {
    if (reqStateRef.current === false) {
      return;
    }

    reqStateRef.current = false;
    const res = await featureOpusForSpace({ id: item.id! }, spaceId);
    if (res.data.status === 1) {
      item.isFeatured = !item.isFeatured;
      setFresh(fresh + 1);
    }
    reqStateRef.current = true;
  }

  async function takeDown(id: number) {
    if (reqStateRef.current === false) {
      return;
    }

    reqStateRef.current = false;
    const res = await takenDownFromSpace({ id: id }, spaceId);
    if (res.data.status === 1) {
      const newArr = dataList.filter((value) => value.id !== id);
      setDataList(newArr);
      let leftTotal = total - 1;
      setTotal(leftTotal);
      if (newArr.length < pageSize && leftTotal > newArr.length) {
        setFreshData(freshData + 1);
      }
      message.info('finish');
      publish('freshSpaceHomeList');
    }
    reqStateRef.current = true;
  }
}
