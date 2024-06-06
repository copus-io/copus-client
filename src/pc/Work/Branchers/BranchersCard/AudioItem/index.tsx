import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { ReactComponent as AudioIcon } from 'src/assets/media/svg2/icon-home-audio.svg';
import { BranchersCardItemProps } from '..';
import AuthorView from '../AuthorView';

const AudioItem = (props: BranchersCardItemProps) => {
  const { item, onMoreClickWithIndex } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);

  const handleMouseEnter = () => {
    setIsPlaying(true);
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className="relative   border-b border-[#e4e0e0]  py-[25px]  h-auto overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      <div className="">
        {item.coverUrl && (
          <div className="relative h-[356px] bg-bg-sixth overflow-hidden rounded-[15px] overflow-hidden">
            <div className="w-full h-full ">
              <img
                src={item.coverUrl}
                alt=""
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
              <ReactPlayer
                ref={playerRef}
                // className={styles.player}
                // url="http://music.163.com/song/media/outer/url?id=447925558.mp3"
                url={item.otherInfos?.content}
                // width="100%"
                // height="100%"
                playsinline
                playing={isPlaying}
                loop
                // muted={!playing}
                // controls
              />
            </div>
            <div
              className="absolute top-[50%] left-[50%] w-[70px] h-[70px]"
              style={{ transform: 'translate(-50%, -50%)' }}
              onMouseEnter={handleMouseEnter}
            >
              <AudioIcon
                className=" w-[70px] h-[70px]"
                onClick={() => setIsPlaying(true)}
              />
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
export default AudioItem;
