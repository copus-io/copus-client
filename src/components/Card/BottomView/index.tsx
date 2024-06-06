import { ReactComponent as BranchIcon } from 'src/assets/media/svg2/icon-home-branch1.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as MoreIcon } from 'src/assets/media/svg2/icon-more-vertical.svg';

import { floorFixedNumber } from 'src/utils/common';

import { Popover } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { userFace } from 'src/components/common';
import { CreationForHome } from 'src/data/use-creation-list';
import useUserInfo from 'src/hooks/use-user-info';
import MoreActions from 'src/pc/Work/Branchers/BranchersCard/AuthorView/MoreActions';
import { publish } from 'src/utils/event';
import styles from './index.module.less';
interface CreationForHomeItemProps {
  item: CreationForHome;
  isTitle?: boolean;
  isBranchView?: boolean;
}

const BottomView = (props: CreationForHomeItemProps) => {
  const userInfo = useUserInfo();
  const { item, isBranchView = false } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between text-[#5e5e5e] text-[14px] ">
      <Link
        className="flex gap-[4px] hover:underline"
        href={'user/' + item.userInfo.namespace}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {userFace(item.userInfo.faceUrl, 'w-[20px] h-[20px]')}
        {item.userInfo.username}
      </Link>
      <div className="flex  items-center text-secondV2 gap-[6px]">
        <div className="flex items-center gap-[4px]">
          <StreamIcon />
          {floorFixedNumber(item.rewardAmount || 0, 2)}
        </div>
        <div className="flex items-center gap-[4px]">
          <BranchIcon />
          {item.downstreamCount || 0}
        </div>
        {userInfo && isBranchView && userInfo.data?.id === item.userInfo.id && (
          <Popover
            overlayClassName={styles.more}
            open={open}
            onOpenChange={setOpen}
            content={
              <MoreActions
                onClickWithIndex={(index) => {
                  setOpen(false);
                  publish('showBranchOps', { id: item.id, type: index });
                }}
              />
            }
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="ml-[6px] flex items-center justify-center "
            >
              <MoreIcon />
            </div>
          </Popover>
        )}
      </div>
    </div>
  );
};
export default BottomView;
