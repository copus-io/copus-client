import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as GroupIcon } from 'src/assets/media/svg2/icon-home-member2.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as SubmitIcon } from 'src/assets/media/svg2/icon-submit.svg';
import { ReactComponent as SubmittedIcon } from 'src/assets/media/svg2/icon-submitted.svg';
import UserAvatar from 'src/components/UserAvatar';
import styles from './index.module.less';

import { message } from 'antd';
import { submitToSpaceReq } from 'src/api/work';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/icon-home-post2.svg';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import useUserInfo from 'src/data/use-user-info';
import { floorFixedNumber } from 'src/utils/common';

interface SpaceItemProps {
  opusId?: number;
  item?: SpaceMetaInfo;
  onClick?: () => void;
}

const SpaceItem = (props: SpaceItemProps) => {
  const { t } = useTranslation();
  const { item, opusId } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: userInfo } = useUserInfo();
  /** 投递 */
  const handleClickSubmit = async () => {
    try {
      if (!userInfo) {
        return;
      }
      if (loading || !opusId || !item?.id) return;
      setLoading(true);
      const res = await submitToSpaceReq({
        opusIds: [opusId],
        spaceIds: [item.id],
      });

      if (res.data.status === 1) {
        setIsSubmitted(true);
        message.success(t('clientUI.success'));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error((error as Error).message);
    }
  };

  return (
    <div className="flex justify-between p-[30px_20px] items-center border-b-[1px] border-[#e0e0e0]">
      <div className="flex ">
        <UserAvatar logoUrl={item?.logoUrl} size={48} faceSize={30} />
        <div className="flex flex-col ml-[15px]">
          <div
            className={clsx(
              'text-[#231f20] text-[18px] font-[500] leading-[23px] mb-[8px] line-clamp-1'
            )}
          >
            {item?.title}
          </div>
          <div className="flex items-center  text-[#696969] text-[14px] font-normal tracking-[0.28px] leading-[130%]">
            <div className=" flex items-center justify-center mr-[4px]">
              <StreamIcon style={{ width: '15px', height: '17px' }} />
            </div>
            <span className="  ml-0">
              {floorFixedNumber(item?.rewardAmount || 0, 0)}
            </span>

            <div className="text-first w-[15px]"></div>

            <div className="rounded-full flex items-center justify-center mr-[4px]">
              <GroupIcon style={{ width: '17px', height: '15px' }} />
            </div>
            <span className="  ml-0">{item?.userCount}</span>
            <div className="text-first  w-[15px]"></div>

            <div className="rounded-ful flex items-center justify-center mr-[4px]">
              <PostIcon style={{ width: '13px', height: '15px' }} />
            </div>
            <span className=" ml-0">{item?.downstreamCount}</span>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          isSubmitted
            ? styles.submitted
            : 'flex items-center rounded-[50px] p-[5px_15px]  border border-[#393939] cursor-pointer text-[#393939] select-none'
        )}
        onClick={() => {
          if (isSubmitted) return;
          handleClickSubmit();
        }}
      >
        {loading && (
          <span className="mr-2">
            <i className="fa fa-circle-o-notch fa-spin" />
          </span>
        )}
        {isSubmitted ? <SubmittedIcon /> : <SubmitIcon />}
        <div className=" ml-[6px]  text-[14px] font-[500] leading-[23px]">
          {isSubmitted ? 'Submitted' : 'Submit'}
        </div>
      </div>
    </div>
  );
};
export default SpaceItem;
