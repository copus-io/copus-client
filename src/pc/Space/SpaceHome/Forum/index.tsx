import { Select } from 'antd';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Masonry } from 'react-masonry-component2';
import { useRecoilValue } from 'recoil';
import { CreationForSpaceHome } from 'src/data/use-creation-list';
import useSpaceCreationListReq from 'src/data/use-space-creation-list';
import useRouterParams from 'src/hooks/use-router-params';
import { keywordAtom } from 'src/recoil/searchKeyword';
import { subscribe } from 'src/utils/event';
import Card from '../../../../components/Card';
import styles from './index.module.less';
import Search from 'src/components/Search';

interface Props {
  isShowItems?: boolean;
}

const Forum = (props: Props) => {
  const { isShowItems } = props;
  const { t } = useTranslation();
  const { spaceId } = useRouterParams();
  const router = useRouter();

  const [creationList, setCreationList] = useState<CreationForSpaceHome[]>([]);

  const [selectIndex, setSelectIndex] = useState(0);
  const [selectTagIndex, setSelectTagIndex] = useState(0);

  const scrollRef = useRef<any>(null);
  const [keyword, setSearchKeyword] = useState('');

  // const keyword = useRecoilValue(keywordAtom); // recoil

  const items = [
    { title: t('clientUI.home.all'), id: -1 },
    { title: t('clientUI.home.Posts'), id: 1 },
    { title: t('clientUI.home.Spaces'), id: 0 },
  ];
  const tags = [
    { title: t('clientUI.home.mostRecent'), id: 0 },
    { title: t('clientUI.home.mostPopular'), id: 10 },
    { title: t('clientUI.home.mostInspiring'), id: 20 },
  ];

  const { data, size, isValidating, total, setSize, error, mutate } =
    useSpaceCreationListReq(
      {
        pageSize: 20,
        keyword: keyword ? keyword : '',
        sortBy: tags[selectTagIndex].id,
        cardType: items[selectIndex].id,
      },
      spaceId
    );

  /** 初始数据 */
  const isLoadingInitialData = !data && !error;
  /** 正在加载更多 */
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  // let loadFlagRef = useRef(false);

  const isEmpty = data?.[0]?.length === 0;
  /** 所有数据加载完毕 */
  const isReachingEnd = isEmpty || creationList.length === total;

  // 加载更多数据
  const loadMoreData = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  const selectLabelFunc = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0 });
      if (size === 1) {
        mutate();
      } else {
        setSize(1);
      }
    }
  };
  useEffect(() => {
    if (data) {
      setCreationList(([] as CreationForSpaceHome[]).concat(...data));
    }
  }, [data]);

  useEffect(() => {
    subscribe('freshSpaceHomeList', () => {
      mutate();
    });
  });
  // onChangeKeyword
  function onChangeKeyword(keyword: string) {
    setSearchKeyword(keyword);
  }

  return (
    <div className={styles.tabs1}>
      {
        <div className="flex h-[41px] items-center justify-between mt-[20px] mb-[20px]   text-[22px] text-[#a9a9a9] font-[450]">
          <Select
            className={styles.tagSelect}
            id="tagSelector"
            value={selectTagIndex}
            onChange={(e) => {
              setSelectTagIndex(e);
            }}
          >
            {tags.map((item: any, index: number) => {
              return (
                <Select.Option key={index} value={index}>
                  {item.title}
                </Select.Option>
              );
            })}
          </Select>
          <div className="w-[250px] mr-[20px]">
            <Search
              searchClassName="!border-x-[1px] !border-[#d8d7d7] !h-[40px]  !rounded-[100px] !pl-[10px]"
              style={{
                backgroundColor: 'rgba(var(--bg-twelfth), 0.4)',
              }}
              isDebounce={true}
              onChange={onChangeKeyword}
            ></Search>
          </div>
        </div>
      }

      {isValidating && size === 1 && (
        <div className="flex flex-1 justify-center pb-[60px]">
          <div>
            <i className="fa fa-circle-o-notch fa-spin mr-1" />
            loading
          </div>
        </div>
      )}
      <div
        className="max-h-[calc(100vh-240px)] "
        id="scrollableDiv"
        ref={scrollRef}
      >
        <InfiniteScroll
          dataLength={creationList.length}
          next={loadMoreData}
          hasMore={!isReachingEnd}
          loader={<div />}
          scrollableTarget="scrollableDiv"
          className="min-w-[1100px]"
        >
          <Masonry
            columnsCountBreakPoints={{
              1440: 4,
              1000: 3,
              686: 2,
              500: 1,
            }}
            gutter={20}
          >
            {creationList.map((item, _) => {
              return (
                <div key={item.uuid} className="mb-[20px]">
                  <Card
                    item={item}
                    onClick={() => {
                      if (item.opusType === 0) {
                        router.push(`/${item.otherInfos?.namespace}`);
                      } else {
                        router.push(`/work/${item.uuid}`);
                      }
                    }}
                  />
                </div>
              );
            })}
          </Masonry>
        </InfiniteScroll>
        {creationList.length > 0 && (
          <div className="h-[80px] flex items-center justify-center text-first">
            {isLoadingMore ? (
              <div>
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
                {t('clientUI.loading')}
              </div>
            ) : isReachingEnd ? (
              t('clientUI.spaceSetting.users.reaching')
            ) : (
              <span
                className="shrink-0 cursor-pointer"
                onClick={() => setSize(size + 1)}
              >
                {t('clientUI.loadMore')}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
