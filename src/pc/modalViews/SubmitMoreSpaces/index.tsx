import { SyncOutlined } from '@ant-design/icons';
import { Divider, Input, Space, Spin } from 'antd';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ChangeIcon } from 'src/assets/media/svg2/icon-change.svg';
import { ReactComponent as SearchIcon } from 'src/assets/media/svg2/icon-search.svg';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import useSpacesCanSubmitListReq from 'src/data/use-opus-spacesCanSubmit-list';
import SpaceItem from './SpaceItem';
import styles from './index.module.less';

const SubmitMoreSpaces = (props: { opusId?: number; uuid: string }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [spacesList, setSpacesList] = useState<SpaceMetaInfo[]>([]);
  const { opusId, uuid } = props;

  const { data, size, isValidating, setSize } = useSpacesCanSubmitListReq({
    pageSize: 3,
    keyword: keyword ? keyword : '',
    uuid: uuid,
  });

  useEffect(() => {
    if (data) {
      setSpacesList(([] as SpaceMetaInfo[]).concat(data[size - 1]));
    }
  }, [data]);

  /** 防抖 */
  const debounceChange = useMemo(() => {
    const loadOptions = (e: any) => {
      if (!e.target.value) {
        setKeyword('');
      }
      setKeyword(e.target.value);
    };
    return debounce(loadOptions, 800);
  }, []);
  return (
    <div className={`flex text-first  items-center`}>
      <div className="flex-col w-full items-center justify-center mt-[30px]">
        <div className="text-[25px]  ml-[20px] leading-[130%] font-[500] mb-[20px]">
          Submit to more spaces
        </div>
        <div>
          <Input
            className={styles.input}
            placeholder={'Search space name'}
            onChange={(e) => {
              e.stopPropagation();
              debounceChange(e);
            }}
            onClick={(e) => {}}
            prefix={<SearchIcon className="text-first pr-[2px]" />}
          />
        </div>
        <div className="">
          <Spin
            spinning={isValidating}
            indicator={
              <SyncOutlined style={{ fontSize: 34, color: '#696969' }} spin />
            }
          >
            {spacesList.length === 0 && <div className="h-[324px]"></div>}

            <Space
              direction="vertical"
              size={0}
              className=" w-full"
              split={<Divider className="bg-[#e0e0e0] !my-[0px]"></Divider>}
            >
              {spacesList?.map((item, index) => {
                return (
                  <div key={index}>
                    <SpaceItem opusId={opusId} item={item} />
                  </div>
                );
              })}
            </Space>
          </Spin>
          <Divider className="bg-[#e0e0e0] !my-[0px]"></Divider>
          <div className="flex flex-col items-center   mt-[15px] ">
            <div
              className="flex items-center justify-center cursor-pointer mt-[15px]"
              onClick={() => {
                setSize(size + 1);
              }}
            >
              <div className=" w-[15px] h-[15px] p-[2px] rounded-[50px] bg-[#696969] flex items-center justify-center">
                <ChangeIcon
                  className={isValidating ? 'fa-spin' : ''}
                ></ChangeIcon>
              </div>
              <div className="ml-[6px] text-[#696969] text-[14px] leading-[23px]">
                {t('clientUI.showBatch')}
              </div>
            </div>
            <div
              onClick={() => {
                router.push('/?itemIndex=2');
              }}
              className="text-center text-[14px] text-[#696969] leading-[130%] mb-[15px]  mt-[10px] underline underline-offset-2 cursor-pointer"
            >
              {t('clientUI.curatorCenter.viewAllSpaces')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(SubmitMoreSpaces);
