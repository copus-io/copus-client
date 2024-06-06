import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReactComponent as InviteIcon } from 'src/assets/media/svg2/ic-invite.svg';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as CurationIcon } from 'src/assets/media/svg2/icon-curation.svg';
import { ReactComponent as MemberIcon } from 'src/assets/media/svg2/icon-home-member.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as SettingIcon } from 'src/assets/media/svg2/icon-setting.svg';
import { CommonModal } from 'src/components/ModalPro';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  spaceLogo,
} from 'src/components/common';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import { useCreatorCenterMyCreatedSpaceListReq } from 'src/data/use-user-creator-center-spaces-list';
import CuratorCenter from 'src/pc/modalViews/CuratorCenter';
import InviteMembers from 'src/pc/modalViews/InviteMember';
import SpaceSetting from 'src/pc/modalViews/SpaceSetting';
import { floorFixedNumber } from 'src/utils/common';
import { subscribe } from 'src/utils/event';

export default function MyCreatedSpaces({
  isFirst,
  keyword,
}: {
  keyword: string;
  isFirst: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [openCuratorCenter, setOpenCuratorCenter] = useState<boolean>(false);
  const [openSpaceSetting, setOpenSpaceSetting] = useState<boolean>(false);
  const [openInviteMember, setOpenInviteMember] = useState<boolean>(false);
  const [currItem, setCurrItem] = useState<SpaceMetaInfo>();
  const handleCancelCallback = () => {
    setOpenCuratorCenter(false);
    setOpenSpaceSetting(false);
    setOpenInviteMember(false);
  };

  useEffect(() => {
    subscribe('gotoSpaceSetting', () => {
      setOpenCuratorCenter(false);
      setOpenSpaceSetting(true);
    });
  }, []);

  const scrollRef = useRef<any>(null);
  const [dataList, setDataList] = useState<SpaceMetaInfo[]>([]);

  const { data, size, isLoading, total, setSize, error } =
    useCreatorCenterMyCreatedSpaceListReq({
      pageSize: 8,
      keyword: keyword ? keyword : '',
    });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || dataList.length === total;
  const loadMoreData = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    if (data) {
      setDataList(([] as SpaceMetaInfo[]).concat(...data));
    }
  }, [data]);

  useEffect(() => {
    setSize(1);
  }, [isFirst]);

  if (isLoading) {
    return <>{loadingView()}</>;
  }

  return <>{isEmpty ? emptyDataTips() : dataView()}</>;

  function dataView() {
    return (
      <div className="flex flex-col h-full ">
        <div
          className="overflow-y-auto w-full"
          id="scrollableCreatedSpacesDiv"
          ref={scrollRef}
        >
          <InfiniteScroll
            dataLength={dataList.length}
            next={loadMoreData}
            hasMore={!isReachingEnd}
            loader={<div />}
            scrollableTarget="scrollableCreatedSpacesDiv"
            className="w-full"
          >
            {dataList.map((item, _) => {
              return itemDiv(item);
            })}
          </InfiniteScroll>

          {dataList.length > 0 &&
            listViewLoadMore(isLoadingMore, isReachingEnd, setSize, size, t)}
        </div>
        {openCuratorCenter && (
          <CommonModal handleCancelCallback={handleCancelCallback}>
            <CuratorCenter spaceId={currItem?.namespace!} />
          </CommonModal>
        )}
        {openSpaceSetting && (
          <CommonModal
            open={openSpaceSetting}
            handleCancelCallback={handleCancelCallback}
            title={t('clientUI.spaceSetting.name')}
          >
            <SpaceSetting spaceId={currItem?.namespace!} />
          </CommonModal>
        )}

        {openInviteMember && (
          <CommonModal handleCancelCallback={handleCancelCallback}>
            <InviteMembers spaceId={currItem?.namespace!} />
          </CommonModal>
        )}
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
          className="w-[360px] flex gap-[10px] items-center py-[30px] cursor-pointer"
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

        <div className="gap-[10px]  flex justify-center  items-center">
          <div
            onClick={() => {
              setCurrItem(item);
              setOpenCuratorCenter(true);
            }}
            className="flex justify-center items-center cursor-pointer"
          >
            <div className="gap-[10px] py-[5px] px-[10px] rounded-[50px] border border-[#696969]  flex justify-center items-center">
              <CurationIcon />
              {t('clientUI.curatorCenter.name')}
            </div>
          </div>

          <div
            onClick={() => {
              setCurrItem(item);
              setOpenInviteMember(true);
            }}
            className="cursor-pointer  flex w-[35px] h-[35px] items-center justify-center border-[1px] rounded-full"
          >
            <InviteIcon />
          </div>
          <div
            onClick={() => {
              setCurrItem(item);
              setOpenSpaceSetting(true);
            }}
            className="cursor-pointer  flex w-[35px] h-[35px] items-center justify-center border-[1px] rounded-full"
          >
            <SettingIcon />
          </div>
        </div>
      </div>
    );
  }
}
