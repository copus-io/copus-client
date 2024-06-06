import { useState } from 'react';
import { OpusCardInfo } from 'src/data/use-insporedvo-list';
import BottomView from './BottomView';

const ResultItem = (props: {
  onAdd?: (item: any) => void;
  item: OpusCardInfo;
}) => {
  const { item, onAdd } = props;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  return (
    <div
      className=" relative  p-[10px] transition bg-[white] w-full rounded-[15px]   hover:bg-bg-twelfth/40   ease-in-out delay-100  duration-300 "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <div
          className="cursor-pointer text-[18px] line-clamp-2  break-words hover:underline "
          onClick={() => {}}
        >
          {item.title}
        </div>
        <div className="mt-[8px]">
          <BottomView item={item}></BottomView>
        </div>
        {isHovered && (
          <div className="flex justify-end  ">
            <div
              className=" mt-[8px] cursor-pointer bg-[#2168c4] text-[16px] text-[white] rounded-[20px] p-[5px_15px] hover:transition-all"
              onClick={(event) => {
                console.log('ResultItem add', item);

                if (onAdd) {
                  onAdd(item);
                }
              }}
            >
              +&nbsp;&nbsp;Add
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ResultItem;
