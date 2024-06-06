import { Popover } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactComponent as BranchIcon } from 'src/assets/media/svg2/icon-home-branch1.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as MoreIcon } from 'src/assets/media/svg2/icon-more-vertical.svg';
import UserAvatar from 'src/components/UserAvatar';
import { CreationForHome } from 'src/data/use-creation-list';
import useUserInfo from 'src/data/use-user-info';
import { floorFixedNumber } from 'src/utils/common';
import MoreActions from './MoreActions';
import styles from './index.module.less';

interface CreationForHomeItemProps {
  item: CreationForHome;
  isAuthor?: boolean;
  moreAction: (index: number) => void;
}

const AuthorView = (props: CreationForHomeItemProps) => {
  const { item, moreAction } = props;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false); // 是否是作者本人
  // const [sourceDatas, setSourceDatas] = useState<OpusCardInfo[]>([]);
  const { data: userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo?.id === item?.userInfo.id) {
      setIsAuthor(true);
    }
  }, [item?.userInfo.id, userInfo]);

  return (
    <div className="flex relative items-center justify-between w-full leading-[18px] !text-[#5e5e5e] text-[14px] h-[18px]">
      <div className="flex ">
        <div className="mx-[3px]">
          <UserAvatar logoUrl={item.userInfo?.faceUrl} size={18} />
        </div>
        <span
          className="ml-1 cursor-pointer hover:underline "
          onClick={(e) => {
            router.push(`/user/${item.userInfo.namespace}`);
            e.stopPropagation();
            // window.open(
            //   `/${cascadeId}/usercenter?userId=${pieceCardInfo.createBy}`
            // );
          }}
        >
          {item.userInfo?.username}
        </span>
      </div>
      <div className="flex items-center  text-[14px]">
        <div className="rounded-full  flex items-center justify-center mr-[4px]">
          <StreamIcon style={{ width: '15x', height: '17px' }} />
        </div>
        <span className="text-[#696969] ml-[4px]">
          {floorFixedNumber(item.rewardAmount || 0, 2)}
        </span>
        <div className="w-[14px]"></div>

        <div className="rounded-full flex items-center justify-center mr-[4px] ">
          <BranchIcon
            style={{
              width: '16px',
              height: '16px',
            }}
          />
        </div>
        <span className="text-[#696969]   ml-[4px]">
          {item.otherInfos?.shareCount || 0}
        </span>
        {/* </div> */}
        <div className="w-[14px]"></div>
        {isAuthor && (
          <Popover
            overlayClassName={styles.more}
            open={open}
            onOpenChange={setOpen}
            content={
              <MoreActions
                onClickWithIndex={(index) => {
                  moreAction(index);
                  setOpen(false);
                }}
              />
            }
          >
            <div className="mr-[5px] flex items-center justify-center ">
              <MoreIcon />
            </div>
          </Popover>
        )}
      </div>
    </div>
  );
};
export default AuthorView;
