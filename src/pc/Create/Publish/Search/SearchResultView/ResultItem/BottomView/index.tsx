import { ReactComponent as BranchIcon } from 'src/assets/media/svg2/icon-home-branch1.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as ViewIcon } from 'src/assets/media/svg2/icon-home-view1.svg';

import UserAvatar from 'src/components/UserAvatar';
import { floorFixedNumber } from 'src/utils/common';

interface CreationForHomeItemProps {
  item: any;
  isTitle?: boolean;
}

const BottomView = (props: CreationForHomeItemProps) => {
  const { item } = props;
  return (
    <div className="flex  justify-between text-[#231f20] text-[16px] font-normal tracking-[0.28px] leading-[130%]">
      <div className="flex">
        <UserAvatar logoUrl={item.userInfo?.faceUrl} size={21} faceSize={12} />
        <span className="text-first ml-[5px]">{item.userInfo?.username}</span>
      </div>

      <div className="flex  items-center">
        <div className=" flex items-center justify-center ">
          <ViewIcon style={{ width: '16px', height: '11px' }} />
        </div>
        <span className=" ml-[4px]">
          {floorFixedNumber(item.otherInfos?.readCount || 0, 0)}
        </span>

        <div className=" w-[14px]"></div>

        <div className="rounded-full  flex items-center justify-center  ">
          <StreamIcon style={{ width: '15x', height: '17px' }} />
        </div>
        <span className="text-secondV2   ml-[4px]">
          {floorFixedNumber(item.rewardAmount || 0, 2)}
        </span>
        <div className="w-[14px]"></div>

        <div className="rounded-full flex items-center justify-center  ">
          <BranchIcon
            style={{
              width: '18px',
              height: '18px',
            }}
          />
        </div>
        <span className="text-secondV2   ml-[4px]">
          {item.otherInfos?.shareCount || 0}
        </span>
        {/* </div> */}
      </div>
    </div>
  );
};
export default BottomView;
