import { ReactComponent as AudioIcon } from 'src/assets/media/svg2/icon-home-audio.svg';

import { useRef, useState } from 'react';

import type { CreationForHome } from 'src/data/use-creation-list';

import ReactPlayer from 'react-player';
import AuthorView from '../AuthorView';
import BottomView from '../BottomView';
interface CreationForHomeItemProps {
  item: CreationForHome;
  isBranchView?: boolean;
  onClickItem: () => void;
}

const AudioItem = (props: CreationForHomeItemProps) => {
  const { item, isBranchView, onClickItem } = props;

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
      onClick={() => {
        onClickItem();
      }}
      className="relative text-first pb-[15px]  h-auto overflow-hidden"
      onMouseLeave={handleMouseLeave}
    >
      <div className="">
        {item.coverUrl && (
          <div className="relative h-[250px] bg-bg-sixth overflow-hidden mb-[15px]">
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
        <div className="px-[10px] mt-[15px]">
          <AuthorView item={item}></AuthorView>
          <div className="mt-[10px]">
            <div className="flex w-full flex-col justify-start items-center ">
              <div className="flex  items-center  w-full">
                <span className="text-[22px] line-clamp-1 text-left   break-words  font-medium text-first leading-[26px] line-clamp-2">
                  {item.title}
                  {/* {chance.sentence({ words: 10 })} */}
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
export default AudioItem;
