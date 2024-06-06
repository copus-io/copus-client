import {
  CaretDownOutlined,
  CaretUpOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Divider, InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import type { OpusCardInfo } from 'src/data/use-insporedvo-list';
import styles from './index.module.less';

const SourceItem = (props: {
  onDelete: () => void;
  onChange: any;
  maxRatio: number;
  item: OpusCardInfo;
}) => {
  const { item, onDelete, onChange, maxRatio } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [max, setMax] = useState(100);
  const [inputValue, setInputValue] = useState((item?.ratio ?? 0.1) * 100);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    // Source 有且只有一个时 最大值
    if (maxRatio === 100) {
      setMax(100);
      return;
    }
    const ratio = item.ratio ? item.ratio : 0;
    setMax(maxRatio + ratio * 100);
  }, [item.ratio, maxRatio]);

  return (
    <div
      className="relative  border border-[#e4e0e0] bg-[#fff] p-[10px] pr-[6px] w-[360px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex items-center ">
        <div
          className=" text-[16px] text-[#231f20] line-clamp-2  break-words w-[220px]"
          onClick={() => {}}
        >
          {item.title}
        </div>
        <Divider
          type="vertical"
          orientation="center"
          className="ml-[5px] mr-[15px]  bg-[#e4e0e0] !h-[42px] w-[1px] "
        />
        <div className={styles.inputNumber}>
          <InputNumber
            className="!w-[80px] !text-[18px]"
            min={1}
            step={1}
            max={max}
            changeOnWheel={true}
            // defaultValue={10}
            value={inputValue}
            formatter={(value) => `${value}%`}
            // parser={(value) => value!.replace('%', '')}
            controls={{
              upIcon: (
                <CaretUpOutlined
                  style={{
                    fillRule: 'evenodd',
                    fontSize: 20,
                    // color: 'red',
                  }}
                ></CaretUpOutlined>
              ),
              downIcon: (
                <CaretDownOutlined
                  style={{
                    fillRule: 'evenodd',
                    fontSize: 20,
                    // color: 'red',
                  }}
                ></CaretDownOutlined>
              ),
            }}
            onChange={(value) => {
              setInputValue(Math.floor(value ?? 1));
              onChange(Math.floor(value ?? 1));
              // console.log(
              //   'setInputValue',
              //   Math.floor(value ?? 1),
              //   max,
              //   maxRatio,
              //   item.ratio
              // );
            }}
          />
        </div>
        <div className="cursor-pointer  ml-[10px] mr-[6px]" onClick={onDelete}>
          <CloseOutlined
          // style={{
          //   fillRule: 'evenodd',
          // }}
          />
        </div>
        {/* <div className="mt-[8px]">
          <BottomView item={{}}></BottomView>
        </div>
        {isHovered && (
          <div className="flex justify-end">
            <div
              className=" mt-[8px] cursor-pointer bg-[#2168c4] text-[16px] text-[white] rounded-[20px] p-[5px_15px]"
              onClick={() => {}}
            >
              +&nbsp;&nbsp;Add
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
export default SourceItem;
