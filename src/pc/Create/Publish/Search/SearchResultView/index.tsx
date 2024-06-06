import { Space } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import useInspiredVOListReq from 'src/data/use-insporedvo-list';
import ResultItem from './ResultItem';
export interface SearchUpstreamParams {
  /**
   * 已经选中的上游文章id,逗号分割
   */
  existIds?: string;
  /**
   * 当前文章的uuid
   */
  uuid?: string;
  keyword?: string;
  onAddItem?: (item: any) => void;
}
const SearchResultView = (props: SearchUpstreamParams) => {
  const { keyword, onAddItem, existIds, uuid } = props;

  const items = [
    { title: 'All', id: 0 },
    { title: 'Recently viewed', id: 1 },
    { title: 'My work', id: 2 },
  ];
  const [selectIndex, setSelectIndex] = useState(0);

  const [type, setType] = useState(0);

  const { data: inspiredDatas = [], isValidating } = useInspiredVOListReq(
    type,
    existIds,
    keyword,
    uuid
  );
  useEffect(() => {
    console.log('initdata  initdata', inspiredDatas);
  }, [inspiredDatas]);
  useEffect(() => {
    console.log('  keyword', keyword);
  }, [keyword]);
  return (
    <div className="relative mx-[8px]">
      <div className="mx-[7px] flex h-[37px] justify-start items-center  text-[16px] text-[#000] font-[400]">
        {items.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(
                '  p-[7px_15px] cursor-pointer',
                index === selectIndex
                  ? 'text-[#fff] bg-[#5e5e5e] p-[7px_15px] rounded-[40px]  font-[600]'
                  : ''
              )}
              onClick={(e) => {
                e.stopPropagation();

                setSelectIndex(index);
                setType(item.id);
              }}
            >
              <div>{item.title}</div>
            </div>
          );
        })}
      </div>
      {isValidating && (
        <div className="flex flex-1 justify-center my-[10px] ">
          <div>
            <i className="fa fa-circle-o-notch fa-spin mr-1" />
            loading
          </div>
        </div>
      )}
      <div className="mt-[10px] max-h-[400px] overflow-auto flex">
        <Space direction="vertical" size={5} className="flex-1 mx-[8px]">
          {inspiredDatas.map((item, index) => {
            return (
              <div key={index} className="">
                <ResultItem item={item} onAdd={onAddItem}></ResultItem>
              </div>
            );
          })}
        </Space>
      </div>
    </div>
  );
};
export default SearchResultView;
