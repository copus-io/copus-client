import clsx from 'clsx';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ExclusiveIcon } from 'src/assets/media/svg2/icon-exclusive.svg';
import { ReactComponent as OpenIcon } from 'src/assets/media/svg2/icon-open.svg';
import { ReactComponent as PrivateIcon } from 'src/assets/media/svg2/icon-private.svg';
import style from '../index.module.less';

interface CreateSecondProps {
  step: number;
  isWeb3: boolean;
  changeStep: (step: number) => void;
  changeLevel: (step: number) => void;
}

const CreateSecond = (props: CreateSecondProps) => {
  const { t } = useTranslation();
  const { step, changeStep, changeLevel } = props;
  const [type, setType] = useState<number>(0);
  const typeList = [
    {
      type: 0,
      typeName: 'Open',
      desc: 'Everyone can view, join, and submit works. Appears on homepage.',
      icon: <OpenIcon />,
    },
    {
      type: 10,
      typeName: 'Exclusive',
      desc: 'Everyone can view, but need to apply to join, and submit works. Appears on homepage.',
      icon: <ExclusiveIcon />,
    },
    {
      type: 20,
      typeName: 'Private',
      desc: 'Only people you choose can view, join, and submit works. Does not appear on homepage.',
      icon: <PrivateIcon />,
    },
  ];

  return (
    <div
      className={`flex flex-col items-center ${
        step === 2 ? '' : 'h-0 overflow-hidden'
      }`}
    >
      <div className="h-[440px] flex flex-col items-center ">
        <div className="text-[38px] leading-[34px] text-center font-[500] text-first mb-[10px]">
          Set openness
        </div>
        <div className="text-[18px] mb-[50px] text-[#231f20]">
          You can edit this later.
        </div>
        <div className="flex items-center">
          {typeList.map((item, index) => (
            <div
              className="flex flex-1 py-[20px] px-[30px] cursor-pointer  rounded-[15px] flex-col items-center"
              key={index}
              onClick={() => {
                setType(item.type);
                changeLevel(item.type);
              }}
              style={{
                background:
                  item.type === type ? 'rgba(228, 224, 224, 0.4)' : '',
              }}
            >
              <div className="h-[88px] flex items-center">{item.icon}</div>
              <div className="text-[18px] mt-[20px] text-center leading-[1.5] line-[1.5] font-[normal] text-first ">
                {item.desc}
              </div>
              <div className="text-[18px]  font-[500] text-first mt-[10px]">
                {item.typeName}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={clsx('flex justify-end w-full mt-12', style.bottomCon)}>
        <div
          className="button-cancel"
          onClick={(e) => {
            e.preventDefault();
            changeStep(1);
          }}
        >
          {t('clientUI.back')}
        </div>
        <button
          className="button-green ml-5"
          onClick={(e) => {
            e.preventDefault();
            changeStep(3);
          }}
        >
          {t('clientUI.continue')}
        </button>
      </div>
    </div>
  );
};
export default memo(CreateSecond);
