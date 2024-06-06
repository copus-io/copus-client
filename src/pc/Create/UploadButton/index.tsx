import React, { useRef } from 'react';
import { ReactComponent as AudioIcon } from 'src/assets/media/svg2/icon-audio.svg';
import { ReactComponent as ImageIcon } from 'src/assets/media/svg2/icon-image.svg';
import { ReactComponent as VideoIcon } from 'src/assets/media/svg2/icon-video.svg';

import { useDrop } from 'ahooks';

type OnDropCallback = (files: FileList | File[]) => void;

const UploadButton = ({
  onDrop,
  type = 'image',
}: {
  onDrop: OnDropCallback;
  type?: string;
}) => {
  const typeData: { [key: string]: any } = {
    image: {
      icon: <ImageIcon></ImageIcon>,
      title: 'image',
      detail: 'Max 10MB each',
      accept: 'image/gif,image/jpeg,image/jpg,image/png,image/webp',
      color: '#ea7db7',
    },
    audio: {
      icon: <AudioIcon></AudioIcon>,
      title: 'audio',
      detail: 'Max audio file size is XXX',
      accept: 'audio/*',
      color: '#74b3ce',
    },
    video: {
      icon: <VideoIcon></VideoIcon>,
      title: 'video',
      detail: 'Max video file size is XXX',
      accept: 'video/*',
      color: '#2b8649',
    },
  };

  const dropRef = useRef(null);

  useDrop(dropRef, {
    // onText: (text, e) => {
    //   console.log(e);
    //   alert(`'text: ${text}' dropped`);
    // },
    onFiles: (files, e) => {
      console.log(e, files);
      onDrop(files);

      // if (files[0].type.startsWith('image/')) {
      //   onDrop(URL.createObjectURL(files[0]));
      //   // setImage(URL.createObjectURL(files[0]));
      // }
      // alert(`${files.length} file dropped`);
    },
    // onUri: (uri, e) => {
    //   console.log(e);
    //   alert(`uri: ${uri} dropped`);
    // },
    // onPaste: (e) => {
    //   console.log(e);
    //   alert(`onPaste  dropped`);
    // },
    // onDom: (content: string, e) => {
    //   alert(`custom: ${content} dropped`);
    // },
    // onDragEnter: () => setIsHovering(true),
    // onDragLeave: () => setIsHovering(false),
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onDrop(Array.from(event.target.files));
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };

  // const GameGrid: React.FC<{ data: any[] }> = ({ data }) => {
  //   // 将数据按3个元素拆分为二维数组
  //   const gridArray = chunkArrayIntoSubarrays(data, 3);

  //   return (
  //     <div>
  //       {gridArray.map((row, rowIndex) => (
  //         <div key={rowIndex}>
  //           {row.map((cell, cellIndex) => (
  //             <GridSquare key={`${rowIndex}-${cellIndex}`} value={cell} />
  //           ))}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <div
      className="flex flex-col items-center justify-center border-dashed h-full w-full border-[2px]  relative   bg-white/80 "
      ref={dropRef}
      style={{
        borderColor: typeData[type].color,
      }}
    >
      <input
        id="file-input"
        type="file"
        accept={typeData[type].accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {/* <ImageIcon></ImageIcon> */}
      {typeData[type].icon}
      <div className="text-first text-[20px] font-[500] mt-[30px] mx-[40px] text-center">
        Drag and drop an {typeData[type].title}, or
        <span className="underline cursor-pointer" onClick={handleClick}>
          {' '}
          browse
        </span>
      </div>
      <div className="text-first text-[16px] font-[400] mt-[20px]">
        {typeData[type].detail}
      </div>
    </div>
  );
};
export default UploadButton;
