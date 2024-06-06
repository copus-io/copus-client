import { ReactComponent as VideoIcon } from 'src/assets/media/svg2/icon-home-video.svg';

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { BranchersCardItemProps } from '..';
import AuthorView from '../AuthorView';
import styles from './index.module.less';

const VideoItem = (props: BranchersCardItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const { item, onMoreClickWithIndex } = props;

  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (playerRef.current) {
    }
  }, [playerRef]);
  const handleMouseLeave = () => {
    setIsPlaying(false);
    // playerRef.current.showPreview();
  };
  return (
    <div
      className="relative   border-b border-[#e4e0e0]  py-[25px]  h-auto overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      <div className="">
        {item.coverUrl && (
          <div className="relative h-[475px] rounded-[15px] overflow-hidden">
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
                // controls
              />
            </div>
            <div
              className="absolute top-[50%] left-[50%] w-[70px] h-[70px]"
              style={{ transform: 'translate(-50%, -50%)' }}
              // onMouseEnter={handleMouseEnter}
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
export default VideoItem;
