import clsx from 'clsx';
import { ReactComponent as EditIcon } from 'src/assets/media/svg2/icon-edit.svg';
import CascadButton from 'src/components/CascadButton';
import styles from './index.module.less';

import router from 'next/router';
import UserAvatar from 'src/components/UserAvatar';

import { Carousel, Image } from 'antd';
import { useEffect, useState } from 'react';
import useUserInfo from 'src/data/use-user-info';
import { OpusInfo } from 'src/data/use-work-detail';
import { formatTimestamp } from 'src/utils/common';

interface ArticleProps {
  articleData?: OpusInfo;
}
const Photos = (props: ArticleProps) => {
  const { articleData } = props;
  const [isAuthor, setIsAuthor] = useState(false); // 是否是作者本人
  const [images, setImages] = useState<string[]>([]); // 是否是作者本人

  const { data: userInfo } = useUserInfo();
  // const images = [
  //   'https://picsum.photos/1000/600?random=1',
  //   'https://picsum.photos/1000/600?random=2',
  //   'https://picsum.photos/1000/600?random=3',
  //   'https://picsum.photos/1000/600?random=4',
  //   'https://picsum.photos/1000/600?random=5',
  //   'https://picsum.photos/1000/600?random=6',
  // ];
  useEffect(() => {
    if (userInfo?.id === articleData?.userInfo.id) {
      setIsAuthor(true);
    }
  }, [articleData?.userInfo.id, userInfo]);

  useEffect(() => {
    if (articleData?.content) {
      let content =
        'https://cascads31.s3.ca-central-1.amazonaws.com/images/client/202405/prod/7753915f280e41caacf37a2da05603f6.jpg,https://cascads31.s3.ca-central-1.amazonaws.com/images/client/202405/prod/a96cf2cd211f4d77bb3b55f23345cf8e.jpeg';
      const imgArr = articleData.content.split(',');
      // const imgArr = content.split(',');

      setImages(imgArr);
    }
  }, [articleData?.content]);

  const settings = {
    customPaging: (i: any) => {
      return (
        <img src={`${images[i]}`} style={{ width: '100%', height: '100%' }} />
      );
    },
    infinite: true,
    speed: 500,
    autoplay: true,
  };
  return (
    <div className={clsx(' !w-full flex relative mt-[80px] ')}>
      <div className="w-full">
        <div className="w-full h-[700px]">
          <Image.PreviewGroup>
            <Carousel {...settings} className={styles.carousel}>
              {images.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-full h-[580px] !flex justify-center items-center"
                  >
                    <Image
                      className="!h-[580px]"
                      src={item}
                      style={{
                        width: 'auto',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                );
              })}
            </Carousel>
          </Image.PreviewGroup>
        </div>
        {/* title */}
        <div className="flex w-full justify-between items-center h-[48px]">
          <div className="text-[38px]  color-[#231f20] font-[500] line-clamp-1">
            {articleData?.title}
          </div>
          {isAuthor && (
            <CascadButton
              // className="!h-[42px]"
              color="#484848"
              title={'Edit'}
              icon={<EditIcon></EditIcon>}
              iconClassName="h-[20px] w-[16px]"
              titleClassName=" text-[16px] font-normal ml-[10px] leading-5"
              onClick={() => {
                router.push(
                  `/create?type=1&uuid=${articleData?.uuid}&cburl=${router.asPath}`
                );
              }}
            ></CascadButton>
          )}
        </div>
        {/* Author */}
        <div className="flex relative items-center w-full leading-[18px] text-[#231f20] text-[16px]  mt-[20px]">
          <div className="">
            <UserAvatar
              logoUrl={articleData?.userInfo?.faceUrl}
              size={20}
              faceSize={12}
            />
          </div>
          <span
            className="ml-[10px] cursor-pointer hover:underline font-[500]"
            onClick={(e) => {
              router.push(`/user/${articleData?.userInfo.namespace}`);
              e.stopPropagation();
              // window.open(
              //   `/${cascadeId}/usercenter?userId=${pieceCardInfo.createBy}`
              // );
            }}
          >
            {articleData?.userInfo?.username}
          </span>
          <span className="mx-[10px]">•</span>

          {articleData?.publishTime && (
            <div>{formatTimestamp(articleData.publishTime as any)}</div>
          )}
        </div>
        {/* content */}
        <div className="mt-[25px] text-[#231f20] text-[18px] leading-[25px]">
          {articleData?.subTitle}
        </div>
      </div>
    </div>
  );
};
export default Photos;
