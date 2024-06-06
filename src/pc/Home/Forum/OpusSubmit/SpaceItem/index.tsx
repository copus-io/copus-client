import clsx from 'clsx';
import { t } from 'i18next';
import { useState } from 'react';
import { ReactComponent as SubmitIcon } from 'src/assets/media/svg2/icon-submit.svg';
import { ReactComponent as SubmittedIcon } from 'src/assets/media/svg2/icon-submitted.svg';
import UserAvatar from 'src/components/UserAvatar';
import styles from './index.module.less';

interface SpaceItemProps {
  title?: string;
  icon?: string;
  onClick?: () => void;
}

const SpaceItem = (props: SpaceItemProps) => {
  const { title = '', icon = '', onClick } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div
      className={clsx(
        styles.imageButton,
        'flex flex-col p-[20px] items-center justify-center border border-[#e4e0e0] py-[30px] h-[178px] w-[170px] rounded-[15px]  overflow-hidden w-[188px] h-[176px]'
        // `hover:border-[2px]`
      )}
      style={{}}
      onClick={onClick}
    >
      <div className="">
        <UserAvatar logoUrl={icon} size={50} faceSize={35} />
      </div>
      <div
        className={clsx(
          'mt-[10px] text-[#393939] text-[14px] font-[500] leading-[23px] mb-[20px] text-center line-clamp-1'
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          isSubmitted
            ? styles.submitted
            : 'flex items-center rounded-[50px] p-[5px_15px] border border-[#393939] cursor-pointer text-[#393939] select-none'
        )}
        onClick={() => {
          setIsSubmitted(true);
        }}
      >
        {isSubmitted ? <SubmittedIcon /> : <SubmitIcon />}
        <div className=" ml-[6px]  text-[14px] font-[500] leading-[23px]">
          {isSubmitted
            ? t('clientUI.opusSubmit.submitted')
            : t('clientUI.opusSubmit.submit')}
        </div>
      </div>
    </div>
  );
};
export default SpaceItem;
