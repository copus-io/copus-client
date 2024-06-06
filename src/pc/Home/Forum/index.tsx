import { Select } from 'antd';
import clsx from 'clsx';
import { toNumber } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Masonry } from 'react-masonry-component2';
import { CommonModal } from 'src/components/ModalPro';
import Search from 'src/components/Search';
import useCreationListReq, {
  CreationForHome,
} from 'src/data/use-creation-list';
import { subscribe } from 'src/utils/event';
import Card from '../../../components/Card';
import OpusSubmit from './OpusSubmit';
import styles from './index.module.less';

const Forum = () => {
  const router = useRouter();

  const itemIndex = router.query.itemIndex as string;
  let tempSelectIndex = 0;
  if (itemIndex) {
    tempSelectIndex = toNumber(itemIndex);
  }

  const { t } = useTranslation();
  const opusId = router.query.opusId as string;
  const [creationList, setCreationList] = useState<CreationForHome[]>([]);

  const [selectIndex, setSelectIndex] = useState(tempSelectIndex);

  const scrollRef = useRef<any>(null);

  const [openSubmitModal, setOpenSubmitModal] = useState(false);

  const handleCancelCallback = () => {
    setOpenSubmitModal(false);
    router.replace('/');
  };

  const [keyword, setSearchKeyword] = useState('');

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

  const [selectTagIndex, setSelectTagIndex] = useState(0);

  const { data, size, isValidating, total, setSize, error, mutate } =
    useCreationListReq({
      pageSize: 20,
      keyword: keyword ? keyword : '',
      sortBy: tags[selectTagIndex].id,
      cardType: items[selectIndex].id,
    });

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || creationList.length === total;

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
      setCreationList(([] as CreationForHome[]).concat(...data));
      const scrollTop = sessionStorage.getItem('scrollTop') || '0';
      if (scrollRef.current && size != 1 && scrollTop != '0') {
        setTimeout(() => {
          scrollRef.current.scrollTo({ top: Number(scrollTop) });
        }, 500);
        setTimeout(() => {
          sessionStorage?.setItem('scrollTop', '0');
        }, 1000 * 3);
      }
    }
    const index = sessionStorage.getItem('tag') || '0';
    setSelectIndex(Number(index));
  }, [data]);
  useEffect(() => {
    if (opusId) {
      setOpenSubmitModal(true);
    }
  }, [opusId]);

  useEffect(() => {
    setSize(1);
    subscribe('OpusSubmit_Close', () => {
      setOpenSubmitModal(false);
      setSelectIndex(2);
    });
  }, []);

  // onChangeKeyword
  async function onChangeKeyword(keyword: string) {
    setSearchKeyword(keyword);
  }

  return (
    <div className={clsx('select-text', styles.tabs1)}>
      <div
        className="flex row items-center justify-between mt-[30px] mb-[20px] pl-[20px] pr-[30px]"
        style={{
          boxSizing: 'border-box',
        }}
      >
        <div className="flex row items-center">
          <div className="flex text-[16px] text-[#a9a9a9] font-[500] ">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    'cursor-pointer',
                    index === selectIndex ? 'text-first' : ''
                  )}
                  onClick={() => {
                    setSelectIndex(index);
                    sessionStorage?.setItem('scrollTop', '0');
                    sessionStorage?.setItem('tag', index + '');
                    selectLabelFunc();
                  }}
                >
                  <div
                    className={clsx(
                      index === selectIndex
                        ? styles.buttonItemSelect
                        : styles.buttonItemNormal
                    )}
                  >
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>
          <Select
            className={styles.tagSelect}
            value={selectTagIndex}
            id="tagSelector"
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
        </div>
        <div className="w-[322px]">
          <Search
            searchClassName="!border-x-[1px] !border-[#d8d7d7] !h-[42px]  !rounded-[100px] !pl-[10px]"
            style={{
              backgroundColor: 'rgba(var(--bg-twelfth), 0.4)',
            }}
            isDebounce={true}
            onChange={onChangeKeyword}
          ></Search>
        </div>
      </div>
      {isValidating && size === 1 && (
        <div className="flex flex-1 justify-center pb-[60px]">
          <div>
            <i className="fa fa-circle-o-notch fa-spin mr-1" />
            loading
          </div>
        </div>
      )}
      <div
        className="overflow-y-auto max-h-[calc(100vh-150px)]  "
        id="scrollableDiv"
        ref={scrollRef}
      >
        <InfiniteScroll
          dataLength={creationList.length}
          next={loadMoreData}
          hasMore={!isReachingEnd}
          loader={<div />}
          scrollableTarget="scrollableDiv"
          className="min-w-[500]"
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
                <div key={item.uuid}>
                  <Card
                    item={item}
                    onClick={() => {
                      const scrollTop = scrollRef.current.scrollTop;
                      sessionStorage.setItem('scrollTop', scrollTop + '');
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

      {openSubmitModal && (
        <CommonModal width={650} handleCancelCallback={handleCancelCallback}>
          <OpusSubmit></OpusSubmit>
        </CommonModal>
      )}
    </div>
  );
};

export default Forum;
