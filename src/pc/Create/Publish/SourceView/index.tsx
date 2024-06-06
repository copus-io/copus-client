import { Space } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Dailog from 'src/components/Dailog';
import SourceItem from './SourceItem';
import styles from './index.module.less';
const SourceView = (props: {
  upstreamList: any[];
  onDelete: (index: number) => void;
  onChange: (item: any, value: number) => void;
}) => {
  const { upstreamList, onChange, onDelete } = props;
  const [dialogShow, setDialogShow] = useState(false);
  const [data, setData] = useState<any[]>(upstreamList);

  const [handleId, setHandleId] = useState(0);

  const [maxRatio, setMaxRatio] = useState(0);

  useEffect(() => {
    console.log('upstreamList', upstreamList);
    setData(upstreamList);
    if (upstreamList.length === 1) {
      setMaxRatio(100);
    } else {
      const sum = upstreamList.reduce((acc, obj) => acc + obj.ratio * 100, 0);
      // 总和超过 100 不允许增加
      setMaxRatio(100 - sum);
    }

    console.log('maxRatio', maxRatio);
  }, [maxRatio, upstreamList]);

  return (
    <div className="relative w-[360px] ">
      <div className="flex justify-between text-[#5e5e5e] text-[16px]  leading-[23px]  mb-[20px] mx-[5px]">
        <div>Source</div>
        <div>Share ratio</div>
      </div>
      <div
        className={
          (clsx(styles.scrollbarSource),
          ' mt-[20px] max-h-[400px]  w-[382px] overflow-x-hidden overflow-y-auto mr-[20px]')
        }
      >
        <Space direction="vertical" size={10}>
          {data.map((item, index) => {
            return (
              <div key={index}>
                <SourceItem
                  key={index}
                  item={item}
                  maxRatio={maxRatio}
                  onDelete={() => {
                    setHandleId(index);
                    setDialogShow(true);
                  }}
                  onChange={(value: number) => {
                    console.log('item  onChange', item);
                    onChange(item, value);
                  }}
                ></SourceItem>
              </div>
            );
          })}
        </Space>
      </div>

      <Dailog
        title="Are you sure to delete this source?"
        open={dialogShow}
        onOk={() => {
          onDelete(handleId);
          setDialogShow(false);
        }}
        onCancel={() => setDialogShow(false)}
      />
    </div>
  );
};
export default SourceView;
