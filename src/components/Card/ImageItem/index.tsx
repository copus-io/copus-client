import { Carousel } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { CreationForHome } from 'src/data/use-creation-list';
import AuthorView from '../AuthorView';
import BottomView from '../BottomView';
interface CreationForHomeItemProps {
  item: CreationForHome;
  isBranchView?: boolean;
  onClickItem: () => void;
}

const ImageItem = (props: CreationForHomeItemProps) => {
  const sliderRef = useRef<any>(null);

  const { item, isBranchView, onClickItem } = props;

  const [images, setImages] = useState([]);

  useEffect(() => {
    const imgs = item.otherInfos?.content?.split(',');
    setImages(imgs);
  }, [item]);

  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    console.log('鼠标移入');
    sliderRef.current.autoPlay(true);
    console.log(sliderRef);
  };

  const handleMouseLeave = () => {
    console.log('鼠标移出');
    sliderRef.current.autoPlay(false);
    sliderRef.current.innerSlider.pause();
  };

  const onChange = (currentSlide: number) => {
    console.log(currentSlide, playing);
  };

  return (
    <div
      onClick={() => {
        onClickItem();
      }}
      className="relative text-first pb-[15px] h-auto overflow-hidden "
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="">
        {item.coverUrl && (
          <div className="relative h-[475px] ">
            <div
              className="w-full h-full overflow-hidden"
              // onClick={(e) => {
              //   e.stopPropagation();
              // }}
            >
              <Carousel
                ref={sliderRef}
                autoplaySpeed={3000}
                // centerMode
                infinite
                afterChange={onChange}
              >
                {images?.map((imgSrc, index) => {
                  return (
                    <div key={index} className="h-[475px]">
                      <img
                        src={imgSrc}
                        alt=""
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        )}
        <div className="px-[10px] mt-[15px]">
          <AuthorView item={item}></AuthorView>
          <div className="mt-[10px]">
            <div className="flex w-full flex-col justify-start items-center ">
              <div className="flex  items-center  w-full">
                <span className="text-[22px] line-clamp-1 text-left   break-words  font-medium text-first leading-[26px] line-clamp-2">
                  {item.title}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-[15px]">
            <div className="">
              <BottomView isBranchView={isBranchView} item={item} isTitle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageItem;
