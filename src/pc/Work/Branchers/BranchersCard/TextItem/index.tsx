import { BranchersCardItemProps } from '..';
import AuthorView from '../AuthorView';
import { Image } from 'antd';
const TextItem = (props: BranchersCardItemProps) => {
  const { item, onMoreClickWithIndex } = props;

  return (
    // hover:shadow-hover  rounded-[15px]
    <div className="relative text-first  border-b border-[#e4e0e0] py-[25px]  h-auto overflow-hidden z-1 ">
      <div className="mt-[10px]">
        {item.coverUrl && (
          <div className="w-full h-full bg-bg-sixth mb-[20px] ">
            <div
              className="w-full h-full"
              // onClick={(e) => {
              //   e.stopPropagation();
              // }}
            >
              <Image
                // width={200}
                src={item.coverUrl}
                preview={false}
              />
            </div>
          </div>
        )}
        <div className="flex w-full flex-col justify-start items-center">
          <div className="flex  items-center  w-full mb-[10px]">
            <span className="text-[22px] line-clamp-1 text-left  break-words  font-medium text-[#231f20] leading-[26px] line-clamp-2">
              {item.title}
              {/* {chance.sentence({ words: 10 })} */}
            </span>
          </div>

          <div className="flex w-full text-[16px] text-left  leading-[23px] item-center">
            <div className="line-clamp-3 text-[#696969]  text-left break-words">
              {item.subTitle || '-'}
              {/* {chance.sentence({ words: 15 })} */}
            </div>
          </div>
        </div>
        <div className="mt-[15px]">
          <AuthorView
            item={item}
            moreAction={onMoreClickWithIndex}
          ></AuthorView>
        </div>
      </div>
    </div>
  );
};
export default TextItem;
