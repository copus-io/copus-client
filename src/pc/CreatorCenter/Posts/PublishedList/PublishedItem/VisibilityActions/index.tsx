import { Divider, Space } from 'antd';
import { memo } from 'react';

export const itemVisibilityActions = [
  {
    id: 1,
    label: 'Public',
    accessLevel: 0,
  },
  {
    id: 2,
    label: 'Private',
    accessLevel: 20,
  },
];

interface MoreListProps {
  onClickWithIndex: (item: any) => void;
}

const VisibilityActions = (props: MoreListProps) => {
  const { onClickWithIndex } = props;

  return (
    <div className="text-first">
      <div className="w-[160px] h-auto rounded-[15px] overflow-hidden">
        <Space
          direction="vertical"
          className="w-full"
          size={0}
          split={<Divider className="bg-[#e0e0e0] my-0" />}
        >
          {itemVisibilityActions.map((item, index) => (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                onClickWithIndex(item);
              }}
              className="flex justify-start items-center h-[55px] cursor-pointer text-[#231f20] bg-[#ffffff] text-[14px] hover:bg-[#f3f3f3] hover:font-[600]"
            >
              <div className="ml-[20px] ">{item.label}</div>
            </div>
          ))}
        </Space>
      </div>
    </div>
  );
};
export default memo(VisibilityActions);
