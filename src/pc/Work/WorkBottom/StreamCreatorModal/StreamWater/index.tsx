import { Input, Space, message } from 'antd';
import clsx from 'clsx';
import { t } from 'i18next';
import { memo, useState } from 'react';
import { rewardReq } from 'src/api/work';
import { ReactComponent as CheckWaterIcon } from 'src/assets/media/svg2/icon-check-water.svg';
import { ReactComponent as CheckedWaterIcon } from 'src/assets/media/svg2/icon-checked-water.svg';
import { OpusInfo } from 'src/data/use-work-detail';
import useUserInfo from 'src/hooks/use-user-info';
import { floorFixedNumber } from 'src/utils/common';

const list = ['1', '8', '18', '68', '98', '198'];

interface StreamWaterProps {
  opusInfo?: OpusInfo;
  onCancel: () => void;
  onStreamSuccess: (amount?: string) => void;
}
const StreamWater = (props: StreamWaterProps) => {
  const { onCancel, opusInfo, onStreamSuccess } = props;

  const [amount, setAmount] = useState('1'); // 水滴数量
  const [loading, setLoading] = useState(false);

  /** hook-用户信息 */
  const { data: userInfo, mutate: userInfoMutate } = useUserInfo();

  /** 打赏 */
  const reward = async () => {
    try {
      console.log('1reward', opusInfo, amount);

      if (loading || !opusInfo?.id) return;

      if (!amount) {
        message.warning(t('clientUI.stream.enterNotice'));
        return;
      }
      setLoading(true);
      console.log('1reward', opusInfo);

      const res = await rewardReq({
        amount: Number(amount),
        opusId: opusInfo!.id,
      });
      if (res.data.data) {
        userInfoMutate();
        // onCancel(true, amount);
        onStreamSuccess(amount);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`flex text-first  items-center`}>
      <div className="flex-col w-full items-center justify-center mt-[10px]">
        <div className="text-[25px] leading-[130%] font-[500] ">
          {t('clientUI.stream.supportTo')}
        </div>
        <div className="text-[##696969] mt-[25px]">
          {t('clientUI.stream.receiver')}
        </div>
        <div className="text-[20px] leading-[130%] font-[500] mt-[5px]">
          {opusInfo?.userInfo.username}
        </div>
        <div className="text-[##696969] mt-[15px] mb-[10px]">
          {t('clientUI.stream.enterAmount')}
        </div>

        <Space size={24} className="w-full">
          {list.map((item) => (
            <div
              key={item}
              className="flex cursor-pointer w-[50px] h-[60px] relative items-center justify-center"
              onClick={() => setAmount(item)}
            >
              <span
                className={`text-[20px] relative z-10 font-semibold top-1 ${
                  item === amount ? 'text-white' : ''
                }`}
              >
                {item}
              </span>

              {item === amount ? (
                <CheckedWaterIcon className="absolute left-0 top-0" />
              ) : (
                <CheckWaterIcon className="absolute left-0 top-0" />
              )}
            </div>
          ))}
        </Space>
        <div className="flex flex-col items-center mt-[30px]">
          <div className="rounded-[15px] flex flex-col items-center border border-[#2168c4] w-[140px] h-[70px] ">
            <Input
              variant="borderless"
              className={clsx(
                'mt-[7px] text-center h-[34px] !w-full !text-[25px] !text-[#a9a9a9] leading-[34px]'
              )}
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (!/^[1-9]\d*?$/.test(value) && value) return;
                if (
                  Number(value) <=
                  floorFixedNumber(userInfo?.tokenAmount || 0, 2)
                ) {
                  setAmount(value || '');
                } else {
                  setAmount(
                    floorFixedNumber(
                      userInfo?.tokenAmount || 0,
                      2
                    ).toString() || ''
                  );
                  message.warning(t('clientUI.stream.maximumNotice'));
                }
              }}
            />
            <div
              className="cursor-pointer mt-[5px] text-[#231f20] text-[14px]"
              onClick={() =>
                setAmount(floorFixedNumber(userInfo?.tokenAmount || 0, 2) + '')
              }
            >
              {t('clientUI.stream.max')}
            </div>
          </div>
          <span className="underline mt-[10px] text-[#484848] ">
            {t('clientUI.stream.currBalance')}{' '}
            {floorFixedNumber(userInfo?.tokenAmount || 0, 2)}
          </span>
        </div>
        <div className="flex justify-end items-end mt-[40px] pb-4">
          <div className="flex justify-end items-center  h-[42px] select-none">
            <div
              className="mr-[30px] text-[#231f20] text-[16px] cursor-pointer"
              onClick={onCancel}
            >
              {t('clientUI.cancel')}
            </div>
            <div
              className="bg-[#2168c4] p-[10px_30px] text-[white] text-[16px] font-[500] rounded-[50px] flex cursor-pointer  leading-[23px]"
              onClick={() => {
                reward();
              }}
            >
              {loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin" />
                </span>
              )}
              {t('clientUI.stream.support')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(StreamWater);
