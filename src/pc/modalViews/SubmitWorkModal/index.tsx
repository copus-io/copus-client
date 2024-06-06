import { Checkbox, Input, message } from 'antd';
import clsx from 'clsx';
import { SetStateAction, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  submitWorksToOneSpaceReq,
  workListCanSubmitToSpaceReq,
} from 'src/api/work';
import Search from 'src/components/Search';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
} from 'src/components/common';
import { CreationForHome } from 'src/data/use-creation-list';
import { publish } from 'src/utils/event';
import styles from './index.module.less';
const pageSize = 8;

const SubmitWorkModal = ({ spaceId }: { spaceId: string }) => {
  let messageToSpace = '';

  const { t } = useTranslation();
  const [containerRef, setContainerRef] = useState<any>();
  const { TextArea } = Input;
  const [dataList, setDataList] = useState<CreationForHome[]>([]);

  const [checkedValues, setCheckedValues] = useState([]);
  const [keyword, setKeyword] = useState('');

  const onChangeCheckBox = (checkedValues: SetStateAction<never[]>) => {
    setCheckedValues(checkedValues);
  };

  async function onChangeKeyword(keyword: string) {
    setKeyword(keyword);
    setPageIndex(1);
  }

  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    workListCanSubmitToSpaceReq(
      {
        pageSize: pageSize,
        pageIndex: pageIndex,
        keyword: keyword,
      },
      spaceId
    ).then((resp) => {
      if (resp) {
        setTotal(resp.totalRecords);

        if (pageIndex === 1) {
          setDataList(resp.data);
        } else {
          setDataList(dataList.concat(...resp.data));
        }

        if (pageIndex >= resp.pageCount) {
          setIsReachingEnd(true);
        } else {
          setIsReachingEnd(false);
        }
      }
      setIsLoading(false);
    });
  }, [freshData, pageIndex, keyword]);

  function loadMoreData() {
    setPageIndex(pageIndex + 1);
  }

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  return (
    <div className="px-[36px] py-[16px]">
      <div className="text-[25px]  font-[500] text-first">
        {t('clientUI.opusSubmitInSpace.title')}
      </div>
      <Search
        searchClassName={clsx(
          styles.search,
          'mt-[20px] !h-[42px]  !rounded-[15px] !pl-[20px]'
        )}
        style={{
          backgroundColor: 'rgba(var(--bg-twelfth), 0.4)',
          border: 'none',
        }}
        pl={t('clientUI.opusSubmitInSpace.searchTips')}
        isDebounce={true}
        onChange={onChangeKeyword}
      ></Search>

      <Checkbox.Group
        onChange={onChangeCheckBox}
        value={checkedValues}
        className="w-full"
      >
        <div className="w-full min-h-[30vh]">{dataView()}</div>
      </Checkbox.Group>

      <div className={clsx(styles.messgae, 'w-[full] mt-[40px]')}>
        <TextArea
          className={clsx('textarea')}
          onChange={(e) => {
            messageToSpace = e.target.value;
          }}
          rows={4}
          placeholder={t('clientUI.opusSubmitInSpace.msgTips')}
        />
      </div>

      <div className={clsx('flex justify-end w-full mt-[45px]')}>
        <div
          className="button-cancel px-[30px]"
          onClick={(e) => {
            e.preventDefault();
            publish('hidePosts');
          }}
        >
          {t('clientUI.cancel')}
        </div>
        <button
          className="button-green ml-5"
          onClick={(e) => {
            e.preventDefault();
            handleClickSubmit();
          }}
        >
          {t('clientUI.opusSubmitInSpace.submit')}
        </button>
      </div>
    </div>
  );

  function dataView() {
    if (isLoading) {
      return loadingView();
    }

    if (isEmpty) {
      return emptyDataTips();
    }

    return (
      <div
        className=" overflow-y-auto  h-[calc(35vh)]"
        ref={(node) => {
          if (node !== null) {
            setContainerRef(node);
          }
        }}
      >
        {containerRef && (
          <InfiniteScroll
            next={loadMoreData}
            dataLength={dataList.length}
            hasMore={!isReachingEnd}
            scrollableTarget={containerRef}
            loader={<div />}
          >
            {dataList.map((item, _) => {
              return itemDiv(item);
            })}
          </InfiniteScroll>
        )}

        {dataList.length > 0 &&
          listViewLoadMore(
            !isReachingEnd,
            isReachingEnd,
            setPageIndex,
            pageIndex,
            t
          )}
      </div>
    );
  }

  function itemDiv(item: CreationForHome) {
    return (
      <div
        className="flex py-[15px] mt-[10px] border-border4 border-b-[1px] items-center justify-between"
        key={item.id}
      >
        <Checkbox className={styles.checkbox} value={item.id}>
          <span className="text-[18px] ml-[7px] h-[100%] text-first">
            {item.title}
          </span>
        </Checkbox>
        <div
          onClick={() => {
            window.open(`/work/${item.uuid}`, '_blank');
          }}
          className="px-[15px]  cursor-pointer  py-[5px] rounded-[20px] border-[#393939] border-[1px] text-[16px] text-first font-[500]"
          style={{
            lineHeight: '1.3',
            height: '31px',
          }}
        >
          {t('clientUI.opusSubmitInSpace.view')}
        </div>
      </div>
    );
  }

  async function handleClickSubmit() {
    let opusIds: Array<number> = [];
    if (checkedValues.length > 0) {
      checkedValues.map((item: any) => {
        opusIds.push(item);
      });
    }
    if (opusIds.length === 0) {
      return;
    }

    try {
      const res = await submitWorksToOneSpaceReq(
        {
          opusIds: opusIds,
          message: messageToSpace!,
        },
        spaceId
      );

      if (res.data.status === 1) {
        message.success(t('clientUI.success'));
        publish('freshSpaceHomeList');

        let newArr = dataList;
        opusIds.forEach((id, _) => {
          newArr = newArr.filter((value) => value.id !== id);
        });
        setDataList(([] as CreationForHome[]).concat(...newArr));
        let leftTotal = total - 1;
        setTotal(leftTotal);
        setFreshData(freshData + 1);
      }
    } catch (error) {
      message.error((error as Error).message);
    }
    onChangeKeyword('');
  }
};

export default memo(SubmitWorkModal);
