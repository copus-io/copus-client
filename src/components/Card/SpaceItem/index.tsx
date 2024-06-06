import { ReactComponent as GroupIcon } from 'src/assets/media/svg2/ic-members.svg';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import styles from './index.module.less';

import { spaceLogo } from 'src/components/common';
import type { CreationForHome } from 'src/data/use-creation-list';
import { floorFixedNumber } from 'src/utils/common';

interface CreationForHomeItemProps {
  item: CreationForHome;
  onClickItem: () => void;
}

const SpaceItem = (props: CreationForHomeItemProps) => {
  const { item, onClickItem } = props;

  return (
    <div className="relative text-first  border-b border-[#e0e0e0] h-auto overflow-hidden z-1">
      <div className="h-[206px]  w-full ">
        <div className="w-full h-full">
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              onClick={() => {
                onClickItem();
              }}
              className=" cursor-pointer rounded-t-[15px]"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <div
              onClick={() => {
                onClickItem();
              }}
              className={styles.defaultSpaceCover}
            ></div>
          )}

          <div
            className={styles.spaceLogo}
            onClick={() => {
              onClickItem();
            }}
          >
            {spaceLogo(
              item?.otherInfos?.logoUrl,
              item.title,
              80,
              'text-[50px]'
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-start items-center mb-[20px]">
        <div className="flex mt-[50px]  items-center  w-[calc(100%-30px)] ">
          <span
            className="text-[25px] line-clamp-1 text-center  m-auto break-words  font-medium text-first leading-[34px] cursor-pointer"
            onClick={() => {
              onClickItem();
            }}
          >
            {item.title}
          </span>
        </div>

        <div className="flex items-center  my-[12px] text-third text-[14px] font-normal gap-[10px]">
          <div className=" flex items-center justify-center gap-[4px]">
            <StreamIcon />
            {floorFixedNumber(item.rewardAmount || 0, 0)}
          </div>
          <div className="rounded-full flex items-center justify-center gap-[4px]">
            <GroupIcon />
            {item.otherInfos?.userCount}
          </div>

          <div className="rounded-ful flex items-center justify-center gap-[4px]">
            <PostIcon />
            {item.downstreamCount || 0}
          </div>
        </div>

        <div className="flex w-[calc(100%-30px)]  text-[16px] text-center  leading-[23px] item-center">
          <div className="line-clamp-3 text-[##393939]  m-auto break-words">
            {item.subTitle || '-'}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpaceItem;
