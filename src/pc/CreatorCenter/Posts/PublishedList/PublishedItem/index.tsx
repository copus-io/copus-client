import { ReactComponent as ArrowIcon } from 'src/assets/media/svg2/icon-arrow.svg';
import { ReactComponent as EditIcon } from 'src/assets/media/svg2/icon-creator-edit.svg';
import { ReactComponent as PlusIcon } from 'src/assets/media/svg2/icon-plus-white.svg';
import styles from './index.module.less';

import { Popover, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { workChangeAccessLevel } from 'src/api/work';
import { spaceLogo, spaceParams } from 'src/components/common';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import { OpusInfoForPublished } from 'src/data/use-user-creator-center-published-list';
import { formatTimestampToDate } from 'src/utils/common';
import { postInfoForListItem } from '../..';
import VisibilityActions, { itemVisibilityActions } from './VisibilityActions';

interface PublishedItemProps {
  item?: OpusInfoForPublished;
  changeAccessLevelCallback?: () => void;
  showInvitedReaderList?: () => void;
  showSpaceList?: () => void;
  showSubmitMoreSpace?: () => void;
}
const PublishedItem = (props: PublishedItemProps) => {
  const router = useRouter();
  const {
    item,
    changeAccessLevelCallback,
    showInvitedReaderList,
    showSpaceList,
    showSubmitMoreSpace,
  } = props;

  const [open, setOpen] = useState(false);
  const [accessLevel, setAccessLevel] = useState(
    item?.accessLevel === 0
      ? itemVisibilityActions[0].label
      : itemVisibilityActions[1].label
  );

  return (
    <div className="flex flex-1 w-full justify-between p-[30px_0px] ">
      {postInfoForListItem(
        'flex items-center  text-[16px] text-[#a9a9a9] mr-[92px] !w-[calc(100%-730px-68px)] overflow-hidden cursor-pointer',
        item,
        router
      )}
      <div className="flex text-[16px] text-[#a9a9a9] w-[730px] items-center justify-center">
        <div className="w-[192px] mr-[92px] flex">
          <div
            onClick={() => {
              if (showSpaceList) {
                showSpaceList();
              }
            }}
            className="cursor-pointer flex"
          >
            {item?.spaceInfos?.map(
              (spaceInfo: SpaceMetaInfo, index: number) => {
                if (index >= 4) {
                  return;
                }

                return (
                  <Tooltip
                    key={spaceInfo.id}
                    overlay={spaceInfoTipInfo(spaceInfo)}
                    color="white"
                  >
                    {spaceLogo(spaceInfo.logoUrl, spaceInfo.title, 38)}
                  </Tooltip>
                );
              }
            )}
          </div>

          <div className="rounded-[50%] overflow-hidden bg-[#696969] flex justify-center items-center w-[36px] h-[36px] cursor-pointer">
            <PlusIcon
              onClick={() => {
                if (showSubmitMoreSpace) {
                  showSubmitMoreSpace();
                }
              }}
            />
          </div>
        </div>
        <div className="w-[110px] mr-[92px]">
          <div className="text-[#484848] text-[16px] flex items-center justify-between">
            <div>{accessLevel}</div>
            <Popover
              overlayClassName={styles.more}
              open={open}
              onOpenChange={setOpen}
              placement="bottom"
              content={
                <VisibilityActions
                  onClickWithIndex={(actionItem: any) => {
                    setOpen(false);
                    if (actionItem.label !== accessLevel) {
                      setAccessLevel(actionItem.label);
                      workChangeAccessLevel({ id: item!.id! });
                      item!.accessLevel = actionItem.accessLevel;
                      if (changeAccessLevelCallback) {
                        changeAccessLevelCallback();
                      }
                    }
                  }}
                />
              }
            >
              <ArrowIcon
                style={{
                  width: '16px',
                  height: '16px',
                  marginLeft: 40,
                  marginTop: 2,
                }}
              />
            </Popover>
          </div>

          {accessLevel === itemVisibilityActions[1].label && (
            <div
              onClick={() => {
                if (showInvitedReaderList) {
                  showInvitedReaderList();
                }
              }}
              className="text-[14px] underline cursor-pointer"
            >
              Invited members
            </div>
          )}
        </div>

        <div className=" w-[110px] mr-[92px] text-[#484848] text-[16px]">
          {formatTimestampToDate(item?.publishTime || 0, true)}
        </div>
        <div className=" w-[40px]">
          <div
            onClick={() => {
              router.push(`/create?uuid=${item?.uuid}&cburl=${router.asPath}`);
            }}
            className="rounded-[50%] overflow-hidden border border-[#696969] flex justify-center items-center w-[35px] h-[35px] cursor-pointer"
          >
            <EditIcon></EditIcon>
          </div>
        </div>
      </div>
    </div>
  );

  function spaceInfoTipInfo(info: SpaceMetaInfo) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="p-[20px] min-w-[120px] "
      >
        <div className="flex justify-center items-center">
          {spaceLogo(info.logoUrl, info.title, 50, 'text-[36px]')}
        </div>
        <div className="flex justify-center items-center text-[#000] text-[18px] font-[600] ">
          {info.title}
        </div>
        <div className="mt-[10px]">
          {spaceParams(info.rewardAmount, info.userCount, info.downstreamCount)}
        </div>
        <div className="flex justify-center items-center  mt-[10px]">
          <span
            onClick={(e) => {
              window.open(info.namespace, '_blank');
            }}
            className="px-[15px] py-[8px] bg-[#000] rounded-full text-[14px] text-[#fff] font-[500] cursor-pointer hover:shadow-hover"
          >
            Visit
          </span>
        </div>
      </div>
    );
  }
};

export default PublishedItem;
