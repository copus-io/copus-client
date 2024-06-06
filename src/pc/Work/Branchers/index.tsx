import clsx from 'clsx';
import useRouterParams from 'src/hooks/use-router-params';

import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Masonry } from 'react-masonry-component2';
import { cutBranchReq, featureReq } from 'src/api/work';
import {
  OpusCardInfo,
  useOpusDownstreamListReq,
} from 'src/data/use-opus-stream-downstream-list';
import useUserInfo from 'src/data/use-user-info';

import { message } from 'antd';
import Card from 'src/components/Card';
import Dailog from 'src/components/Dailog';
import { subscribe } from 'src/utils/event';

const Branches = (props: { opusId?: number }) => {
  // const scrollRef = useRef<any>(null);
  const [branchDataList, setBranchDataList] = useState<OpusCardInfo[]>([]);
  const router = useRouter();
  const { data: userInfo } = useUserInfo();
  const { workUuid } = useRouterParams();
  const [showTakeDown, setShowTakeDown] = useState(false);
  const [showFeature, setShowFeature] = useState(false);
  const [handelBranchId, setHandelBranchId] = useState<number | undefined>();

  const { t } = useTranslation();
  const { data, size, isValidating, total, setSize, error, mutate } =
    useOpusDownstreamListReq({
      pageSize: 20,
      uuid: workUuid,
    });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || branchDataList?.length === total;
  const loadMoreData = () => {
    console.log('loadMoreData', size);
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };
  useEffect(() => {
    if (data) {
      setBranchDataList(([] as OpusCardInfo[]).concat(...data));
    }
  }, [data]);

  useEffect(() => {
    subscribe('showBranchOps', (e: CustomEvent) => {
      setHandelBranchId(e.detail.id);
      if (e.detail.type === 0) {
        setShowFeature(true);
      }
      if (e.detail.type === 1) {
        setShowTakeDown(true);
      }
    });
  }, []);

  async function moreAction(index: number, branchId?: number) {
    try {
      if (!userInfo) {
        return;
      }

      if (!branchId) return;

      setShowFeature(false);
      setShowTakeDown(false);

      let res;
      if (index === 0) {
        res = await featureReq(workUuid, branchId);
      } else {
        res = await cutBranchReq(workUuid, branchId);
      }
      if (res.data.status === 1) {
        mutate();
        message.success(t('clientUI.success'));
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  }

  return (
    <div className={clsx(' !w-full flex relative mt-[30px] px-[15px]')}>
      <div className="w-full">
        <div className="text-[20px] color-[#231f20] ">
          {t('clientUI.postDetailInfo.branches')}
        </div>
        {branchDataList.length === 0 && (
          <div className="text-[18px] w-full  color-[#231f20] font-[500] py-[50px] text-center">
            {isValidating ? (
              <div className="flex flex-1 justify-center pb-[60px]">
                <div>
                  <i className="fa fa-circle-o-notch fa-spin mr-1" />
                  {t('clientUI.loading')}
                </div>
              </div>
            ) : (
              <div>{t('clientUI.postDetailInfo.noBranch')}</div>
            )}
          </div>
        )}
        <InfiniteScroll
          dataLength={branchDataList.length}
          next={loadMoreData}
          hasMore={!isReachingEnd}
          loader={<div />}
          scrollableTarget="scrollableDiv"
          // className="w-[970px]"
        >
          <Masonry
            columnsCountBreakPoints={{
              1440: 4,
              1000: 3,
              686: 2,
              500: 1,
            }}
            gutter={20}
          >
            {branchDataList.map((item, _) => {
              return (
                <div key={item.uuid} className="mb-[20px]">
                  <Card
                    item={item}
                    isBranchView={true}
                    onClick={() => {
                      router.push(`/work/${item.uuid}`);
                    }}
                  />
                </div>
              );
            })}
          </Masonry>
        </InfiniteScroll>

        {branchDataList.length > 0 && (
          <div className="h-[80px] flex items-center justify-center text-first">
            {isLoadingMore ? (
              <div>
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
                {t('clientUI.loading')}
              </div>
            ) : isReachingEnd ? (
              t('clientUI.spaceSetting.users.reaching')
            ) : (
              <span
                className="shrink-0 cursor-pointer"
                onClick={() => setSize(size + 1)}
              >
                {t('clientUI.loadMore')}
              </span>
            )}
          </div>
        )}
      </div>

      <Dailog
        title="Are you sure you want to cut off this branch?"
        open={showTakeDown}
        mask={true}
        onOk={() => {
          setShowTakeDown(false);
          moreAction(1, handelBranchId);
        }}
        onCancel={() => setShowTakeDown(false)}
      />

      <Dailog
        title="Are you sure you want to do that?"
        open={showFeature}
        mask={true}
        onOk={() => {
          setShowFeature(false);
          moreAction(0, handelBranchId);
        }}
        onCancel={() => setShowFeature(false)}
      />
    </div>
  );
};
export default Branches;
