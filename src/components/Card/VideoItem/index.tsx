import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { ReactComponent as VideoIcon } from 'src/assets/media/svg2/icon-home-video.svg';
import type { CreationForHome } from 'src/data/use-creation-list';
import AuthorView from '../AuthorView';
import BottomView from '../BottomView';
import styles from './index.module.less';

interface CreationForHomeItemProps {
  item: CreationForHome;
  isBranchView?: boolean;
  onClickItem: () => void;
}

const VideoItem = (props: CreationForHomeItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const { item, isBranchView, onClickItem } = props;

  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (playerRef.current) {
    }
  }, [playerRef]);
  const handleMouseLeave = () => {
    setIsPlaying(false);
  };
  return (
    <div
      onClick={() => {
        onClickItem();
      }}
      className="relative text-first pb-[15px] h-auto overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      <div className="">
        {item.coverUrl && (
          <div className="relative h-[475px] mb-[15px]">
            <div className="w-full h-full   overflow-hidden ">
              <ReactPlayer
                ref={playerRef}
                className={styles.player}
                url={item.otherInfos?.content}
                width="100%"
                height="100%"
                playing={isPlaying}
                pip
                muted={!isPlaying}
                loop
              />
            </div>
            <div
              className="absolute top-[50%] left-[50%] w-[70px] h-[70px]"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {!isPlaying && (
                <VideoIcon
                  className=" w-[70px] h-[70px]"
                  onClick={() => setIsPlaying(true)}
                />
              )}
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
export default VideoItem;
