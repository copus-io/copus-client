import clsx from 'clsx';
import { ReactComponent as FractOpusIcon } from 'src/assets/media/svg2/ic-fractopus.svg';
import { ReactComponent as DownArrowIcon } from 'src/assets/media/svg2/icon-arrow-down.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as WorkBranchIcon } from 'src/assets/media/svg2/icon-work-branch.svg';
import { ReactComponent as MoreIcon } from 'src/assets/media/svg2/icon-work-more.svg';
import CascadButton from 'src/components/CascadButton';
import useRouterParams from 'src/hooks/use-router-params';
import styles from './index.module.less';

import { RightOutlined } from '@ant-design/icons';
import { Divider, Popover, Space } from 'antd';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { CommonModal } from 'src/components/ModalPro';
import Graph from 'src/components/SIgma2/Graph';
import { showInfoTip, spaceLogo } from 'src/components/common';
import { useOpusInSpacesReq } from 'src/data/use-opus-inSpaces-list';
import { useOpusStreamListReq } from 'src/data/use-opus-stream-downstream-list';
import useHomeGraphDataList from 'src/data/use-space-graphData-list';
import useUserInfo from 'src/data/use-user-info';
import { OpusInfo } from 'src/data/use-work-detail';
import SubmitMoreSpaces from 'src/pc/modalViews/SubmitMoreSpaces';
import { upstreamAtom } from 'src/recoil/branchUpstream';
import { floorFixedNumber, truncateString } from 'src/utils/common';
import { publish } from 'src/utils/event';

interface WorkSideProps {
  sideData?: OpusInfo;
  onClose: () => void;
}
const WorkSide = (props: WorkSideProps) => {
  const { t } = useTranslation();
  const { workUuid } = useRouterParams();
  const { onClose, sideData } = props;
  const [isAuthor, setIsAuthor] = useState(false); // 是否是作者本人
  const [showMore, setShowMore] = useState(false); // 是否是作者本人
  const [, setCreatUpstreamData] = useRecoilState(upstreamAtom);
  const { data: graphData, isLoading } = useHomeGraphDataList('', 3, workUuid);

  // const [sourceDatas, setSourceDatas] = useState<OpusCardInfo[]>([]);
  const { data: userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo?.id === sideData?.userInfo.id) {
      setIsAuthor(true);
    }
  }, [sideData?.userInfo.id, userInfo]);

  const { data: sourceDatas } = useOpusStreamListReq(workUuid);
  const { data: spacesDatas, mutate: spaceMutate } =
    useOpusInSpacesReq(workUuid);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);

  const handleCancelCallback = () => {
    setOpenSubmitModal(false);
    spaceMutate();
  };

  function fractIconView() {
    if (!sideData?.fractArId) {
      return;
    }

    let now = new Date();
    let then = new Date(sideData.publishTime);
    let diff = now.getTime() - then.getTime();
    let arUrl = 'https://viewblock.io/zh-CN/arweave/tx/' + sideData?.fractArId;
    if (diff < 20 * 60 * 1000) {
      arUrl = 'https://arseed.web3infra.dev/' + sideData?.fractArId;
    }

    return (
      <Popover
        placement="bottomLeft"
        arrow={false}
        color="#484848"
        content={
          <div className="px-[15px] py-[10px] bg-[#484848] text-[white] text-[14px] rounded-[15px]">
            {t('clientUI.postDetailInfo.fractTips')}
          </div>
        }
      >
        <a href={arUrl} target="blank">
          <FractOpusIcon />
        </a>
      </Popover>
    );
  }

  return (
    <div className={clsx('h-full flex relative')}>
      <div
        className="absolute w-[30px] top-[20px] h-[30px] flex items-center bg-[#f3f3f3]  border-y border-r border-[#e0e0e0] rounded-r-[15px] cursor-pointer z-[1]"
        onClick={onClose}
      >
        <RightOutlined className="text-[#a9a9a9] ml-[5px] text-[16px]" />
      </div>
      <div
        className={clsx(
          'h-full w-full overflow-y-auto p-[20px_0px_30px_0] relative',
          styles.hide1000
        )}
      >
        <div className="flex mt-[20px] ml-[30px] gap-[15px] py-[40px]">
          <CascadButton
            title={t('clientUI.postDetailInfo.branch')}
            icon={
              <WorkBranchIcon className="h-[30px] w-[30px]"></WorkBranchIcon>
            }
            color="#f23a00"
            type="filled"
            titleClassName="text-[18px] "
            onClick={() => {
              if (!userInfo) {
                publish('showLoginView');
                return;
              }

              setCreatUpstreamData({
                ratio: 0.1,
                upstreamOpusId: sideData!.id,
                title: sideData!.title,
              });
              publish('open_work_createOpusModal');
            }}
          ></CascadButton>
          {!isAuthor && (
            <CascadButton
              title={t('clientUI.postDetailInfo.support')}
              iconClassName="w-[30px] !h-[30px] bg-[white] rounded-[50px]"
              icon={<StreamIcon></StreamIcon>}
              color="#2191FB"
              type="filled"
              titleClassName="text-[18px]"
              onClick={() => {
                if (!userInfo) {
                  publish('showLoginView');
                  return;
                }

                publish('open_work_streamModal');
              }}
            ></CascadButton>
          )}
        </div>

        <Divider className="bg-[#e0e0e0]"></Divider>
        {/* Total Stream */}
        <div className="flex m-[30px] items-center gap-[10px]">
          <div className="text-[#231f20]  text-[16px] font-[500] mr-[2px]">
            {t('clientUI.postDetailInfo.totalStream')}{' '}
            {showInfoTip(t('clientUI.postDetailInfo.totalStreamTips'))}
          </div>

          <div className="flex items-center gap-[4px] text-[#231f20] ml-[5px] text-[16px] mr-[3px]">
            <StreamIcon></StreamIcon>
            {floorFixedNumber(sideData?.rewardAmount || 0, 2)}
          </div>
        </div>
        <Divider className="bg-[#e0e0e0]"></Divider>

        {/* Sources */}
        <div className="flex flex-col m-[30px] ">
          <div className="flex items-center justify-between">
            <div className="text-[#231f20]  text-[16px] font-[500] mr-[2px]">
              {t('clientUI.postDetailInfo.sources')}{' '}
              {showInfoTip(
                t('clientUI.postDetailInfo.sourcesTips'),
                'w-[270px]'
              )}
            </div>
            {fractIconView()}
          </div>
          {sourceDatas?.length === 0 && isAuthor && (
            <Link
              className="mt-[15px] text-[#484848] underline cursor-pointer"
              href={`/create?uuid=${sideData?.uuid}&cburl=${router.asPath}`}
            >
              {t('clientUI.postDetailInfo.addSource')}
            </Link>
          )}
          <Space direction="vertical" size={10} className="mt-[15px]">
            {sourceDatas?.map((item, index) => {
              return (
                <div key={index} className=" ">
                  <Link
                    className="text-[14px]  hover:underline"
                    href={'/work/' + item.uuid}
                  >
                    <span className="text-[#231f20] break-words">
                      {truncateString(item.title, 30)}
                    </span>
                    <span className="text-[#2168c4] font-[600]">
                      &nbsp;- {floorFixedNumber(item.ratio * 100 || 0, 2)}%
                    </span>
                  </Link>
                </div>
              );
            })}
          </Space>
        </div>
        <Divider className="bg-[#e0e0e0]"></Divider>

        {/* Spaces */}
        <div className="flex flex-col m-[30px] ">
          <div className="text-[#231f20]  text-[16px] font-[500] mr-[2px]">
            {t('clientUI.postDetailInfo.spaces')}
          </div>

          <Space direction="vertical" size={18} className="mt-[15px]">
            {spacesDatas
              ?.slice(0, showMore ? spacesDatas.length : 5)
              .map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <Link
                      className="flex  items-center  justify-center  text-[14px] cursor-pointer  hover:underline"
                      href={'/' + item.namespace}
                    >
                      {spaceLogo(item.logoUrl, item.title, 25, 'text-[10px]')}
                      <div className="w-[180px] text-[#231f20] ml-[15px] line-clamp-1  break-words">
                        {item.title}
                      </div>
                    </Link>

                    {isAuthor && (
                      <div className="flex items-center justify-center p-[3px] text-[14px] text-[#231f20] font-[600] hover:bg-[#e0e0e0]  rounded-[40px] cursor-pointer select-none">
                        <MoreIcon></MoreIcon>
                      </div>
                    )}
                  </div>
                );
              })}
          </Space>

          {spacesDatas && spacesDatas?.length > 5 && !showMore && (
            <div
              className="flex items-center mt-[20px] text-[#696969] hover:underline cursor-pointer"
              onClick={() => setShowMore(true)}
            >
              <DownArrowIcon></DownArrowIcon>
              <div className="ml-[15px] inline-block">
                {t('clientUI.home.show')} {spacesDatas?.length - 5}{' '}
                {t('clientUI.home.more')}
              </div>
            </div>
          )}
          {isAuthor && (
            <div
              className="mt-[15px] text-[#484848] underline cursor-pointer"
              onClick={() => setOpenSubmitModal(true)}
            >
              {t('clientUI.postDetailInfo.submitToSpaceR')}
            </div>
          )}
        </div>
        <Divider className="bg-[#e0e0e0]"></Divider>
        {/* Graph view */}
        <div className="flex flex-col m-[30px] ">
          <div className="text-[#231f20]  text-[16px] font-[500] mr-[2px]">
            {t('clientUI.home.graphView')}
          </div>
          <div className="mt-[15px] bg-[#f3f3f3] h-[300px] border border-border">
            <Graph
              data={graphData}
              isLoading={isLoading}
              parentPage={3}
              width={250}
              type={true}
            />
          </div>
        </div>
      </div>

      {openSubmitModal && (
        <CommonModal handleCancelCallback={handleCancelCallback}>
          <SubmitMoreSpaces opusId={sideData!.id} uuid={sideData!.uuid!} />
        </CommonModal>
      )}
    </div>
  );
};
export default WorkSide;
