import { Divider, Space } from 'antd';
import React, { memo } from 'react';
import { ReactComponent as CutIcon } from 'src/assets/media/svg2/icon-cut.svg';
import { ReactComponent as TopIcon } from 'src/assets/media/svg2/icon-top.svg';
interface MoreListProps {
  onClickWithIndex: (index: number) => void;
}

const MoreActions = (props: MoreListProps) => {
  const { onClickWithIndex } = props;

  const items = [
    {
      id: 1,
      icon: (
        <div className=" w-[25px] h-[25px] p-[2px] rounded-[50px] bg-[#484848] flex items-center justify-center">
          <TopIcon></TopIcon>
        </div>
      ),
      label: 'Feature',
    },
    {
      id: 2,
      icon: (
        <div className="w-[25px] h-[25px] p-[2px] rounded-[50px] border border-[#696969] flex items-center justify-center">
          <CutIcon></CutIcon>
        </div>
      ),
      label: 'Cut branch',
    },
  ];

  return (
    <div className="text-first">
      <div className="w-[146px] h-auto rounded-[15px] overflow-hidden">
        <Space
          direction="vertical"
          className="w-full"
          size={0}
          split={<Divider className="bg-[#e0e0e0] my-0" />}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                onClickWithIndex(index);
              }}
              className="flex justify-start items-center h-[55px] cursor-pointer text-[#231f20] bg-[#ffffff] text-[14px] hover:bg-[#e0e0e0] hover:font-[600]"
            >
              <div className="ml-[20px]">{item.icon}</div>
              <div className="ml-[12px] ">{item.label}</div>
            </div>
          ))}
        </Space>
      </div>
    </div>
  );
};
export default memo(MoreActions);
