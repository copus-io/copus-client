import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './index.module.less';

interface ImageButtonProps {
  title: string;
  icon: ReactNode;
  hoverBorder: string;
  onClick?: () => void;
}

const ImageButton = (props: ImageButtonProps) => {
  const { title, icon, hoverBorder, onClick } = props;
  return (
    <div
      className={clsx(
        styles.imageButton,
        hoverBorder,
        'flex flex-col mx-auto items-center justify-center border border-[#e4e0e0] py-[30px] h-[178px] w-[170px] rounded-[15px]  overflow-hidden ',
        `hover:border-[2px]`
      )}
      style={{}}
      onClick={onClick}
    >
      <div className="">{icon}</div>
      <div
        className={clsx(
          'mt-[20px] text-first text-[20px] font-[600] leading-[23px]'
        )}
      >
        {title}
      </div>
    </div>
  );
};
export default ImageButton;
