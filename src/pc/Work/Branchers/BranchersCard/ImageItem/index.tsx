import { useEffect, useRef, useState } from 'react';

import { Carousel } from 'antd';
import { BranchersCardItemProps } from '..';
import AuthorView from '../AuthorView';

const ImageItem = (props: BranchersCardItemProps) => {
  const sliderRef = useRef<any>(null);

  const { item, onMoreClickWithIndex } = props;
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
      className="relative   border-b border-[#e4e0e0]  py-[25px]  h-auto overflow-hidden"
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div className="">
        {item.coverUrl && (
          <div className="relative h-[475px] rounded-[15px] overflow-hidden">
            <div className="w-full h-full overflow-hidden">
              <Carousel
                ref={sliderRef}
                // arrows
                autoplaySpeed={3000}
                centerMode
                infinite
                // appendDots={(dots) => (
                //   <div
                //     style={{
                //       backgroundColor: '#aaa',
                //       borderRadius: '10px',
                //       padding: '10px',
                //     }}
                //   >
                //     <ul style={{ margin: '0px' }}> {dots} </ul>
                //   </div>
                // )}
                // dots={{}}
                // customPaging={(i) => (
                //   <div className="text-[red] w-[10px] h-[10px] flex">
                //     {' '}
                //     <img src={images[i]} />
                //   </div>
                // )}
                // className="center"
                // slidesToShow={1}
                // slidesToScroll={1}
                // centerPadding="20px"
                afterChange={onChange}
                // autoplay={true}
                // pauseOnHover
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
        <div className="mt-[10px]">
          <div className="">
            <AuthorView
              item={item}
              moreAction={onMoreClickWithIndex}
            ></AuthorView>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageItem;
