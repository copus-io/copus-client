import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LittleWaterIcon } from 'src/assets/media/svg2/icon-home-water1.svg';
import { OpusInfo } from 'src/data/use-work-detail';
import { formatPercentNum } from 'src/utils/common';

interface SuccessModalProps {
  data?: any;
  opusInfo?: OpusInfo;
}

const Success = (props: SuccessModalProps) => {
  const { data, opusInfo } = props;
  const { t } = useTranslation();

  // 数据
  const destination = useMemo(() => {
    const amountNum = new BigNumber(Number(data?.amount));
    const ratioNum = new BigNumber(opusInfo?.ratio || 0);
    const toCascade = amountNum.times(ratioNum).toString();
    const toCreator = amountNum.minus(new BigNumber(toCascade)).toString();
    console.log('destination', toCascade, toCreator);
    return {
      toCreator,
      toCascade,
    };
  }, [data, opusInfo?.ratio]);

  return (
    <div className={`flex text-first  items-center`}>
      <div className="flex-col w-full items-center justify-center mt-[10px] mx-[10px]">
        <div className="text-[25px] text-center">
          {t('clientUI.stream.supportSuccess')}
        </div>
        <div className="mt-[25px]">
          <div className="pb-[15px] border-b-[1px] border-[#e0e0e0]">
            <div className="text-[#484848] mb-[5px]">
              {t('clientUI.spaceSetting.general.totalStream')}
            </div>
            <div className="flex items-center">
              <LittleWaterIcon className="mr-[5px] relative " />
              {data?.amount}
            </div>
          </div>

          <div className="mt-[15px] pb-[15px] border-b-[1px] border-[#e0e0e0]">
            <div className="text-[#484848] mb-[5px]">
              {t('clientUI.stream.toCreator')}:
            </div>
            <div className="flex items-center">
              <LittleWaterIcon className="mr-[5px] relative " />
              {destination?.toCreator}
            </div>
          </div>
          <div className="mt-[15px] pb-[15px] border-b-[1px] border-[#e0e0e0]">
            <div className="text-[#484848] mb-[5px]">
              {t('clientUI.stream.toTreasury')} (
              {t('clientUI.spaceSetting.general.taxRate')}{' '}
              {formatPercentNum((opusInfo?.ratio ?? 0) * 100 || 0, 0)}%):
            </div>
            <div className="flex items-center">
              <LittleWaterIcon className="mr-[5px] relative " />
              {destination?.toCascade}
            </div>
          </div>
          <div className="my-[20px] text-[#696969] text-[14px]">
            {t('clientUI.stream.feeTips')}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Success;
