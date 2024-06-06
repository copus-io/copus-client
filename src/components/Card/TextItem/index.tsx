import { Image } from 'antd';
import type { CreationForHome } from 'src/data/use-creation-list';
import BottomView from '../BottomView';

interface CreationForHomeItemProps {
  item: CreationForHome;
  isBranchView?: boolean;
  onClickItem: () => void;
}

const TextItem = (props: CreationForHomeItemProps) => {
  const { item, isBranchView, onClickItem } = props;

  return (
    <div className="relative text-first  border-b border-[#e0e0e0] pb-[25px] overflow-hidden max-w-[350px]">
      {item.coverUrl && (
        <div className="w-full h-full mb-[20px]">
          <div className="w-full  h-auto">
            <Image
              className="rounded-[15px] cursor-pointer"
              onClick={() => {
                onClickItem();
              }}
              preview={false}
              src={item.coverUrl}
            />
          </div>
        </div>
      )}
      <div className="flex w-full flex-col justify-start items-center">
        <div
          onClick={() => {
            onClickItem();
          }}
          className="flex  items-center  w-full mb-[10px] cursor-pointer"
        >
          <span className="text-[22px] line-clamp-1 text-left  break-words  font-medium text-[#393939] line-clamp-2">
            {item.title}
          </span>
        </div>

        <div className="flex  w-full text-[16px] text-left  item-center">
          <div className="line-clamp-3 text-secondV2  text-left break-words">
            {item.subTitle || '-'}
          </div>
        </div>
      </div>
      <div className="mt-[15px]">
        <BottomView isBranchView={isBranchView} item={item} />
      </div>
    </div>
  );
};
export default TextItem;
