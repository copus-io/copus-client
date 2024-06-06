import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { banUserReq, changeUserRoleReq } from 'src/api/user';
import { ReactComponent as DownIcon } from 'src/assets/media/svg/icon-down.svg';
import PopoverPro from 'src/components/PopoverPro';
import Search from 'src/components/Search';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  userFace,
} from 'src/components/common';
import useSpaceDetailReq from 'src/data/use-space-detail';
import {
  spaceUserListReq,
  type PageSpaceMemberInfo,
} from 'src/data/use-space-user-list';
import { userRole } from '../../static';

const pageSize = 4;

const AllMembers = ({ spaceId }: { spaceId: string }) => {
  const { t } = useTranslation();

  const { data: spaceDetail } = useSpaceDetailReq(spaceId);

  const [containerRef, setContainerRef] = useState<any>();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [dataList, setDataList] = useState<PageSpaceMemberInfo[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [freshData, setFreshData] = useState(0);
  const [total, setTotal] = useState(0);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    spaceUserListReq(
      {
        pageSize: pageSize,
        pageIndex: pageIndex,
        keyword: keyword ? keyword : '',
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
  }, [pageIndex, freshData, keyword]);

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  const loadMoreData = () => {
    setPageIndex(pageIndex + 1);
  };

  const onChangeKeyword = useCallback((value: any) => {
    setKeyword(value);
    setPageIndex(1);
    setIsLoading(true);
  }, []);

  /** 修改用户权限 */
  const changeUserRole = async (id: number, role: number) => {
    try {
      if (isActionLoading) return;
      setIsActionLoading(true);

      const res = await changeUserRoleReq(id, spaceId);
      if (res.data.status) {
        message.success(t('clientUI.success') + '!');
        setDataList((data) =>
          data.map((item) => (id === item.id ? { ...item, role } : item))
        );
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setIsActionLoading(false);
    }
  };

  /** 移除用户 */
  const banUser = (id: number) => {
    Modal.confirm({
      title: t('clientUI.spaceSetting.users.banUserTips'),
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: t('clientUI.yes'),
      cancelText: t('clientUI.no'),
      onOk: async () => {
        try {
          if (isActionLoading) return;
          setIsActionLoading(true);

          const res = await banUserReq(id, spaceId);
          if (res.data.status) {
            message.success(t('clientUI.success') + '!');

            const newArr = dataList.filter((item) => id !== item.id);
            setDataList(newArr);
            let leftTotal = total - 1;
            setTotal(leftTotal);
            if (newArr.length < pageSize && leftTotal > newArr.length) {
              setFreshData(freshData + 1);
            }
          }
        } catch (error) {
          message.error((error as Error).message);
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  return (
    <div className="w-[100%]">
      <Search
        searchClassName="mb-[10px]"
        style={{
          background: '#f3f3f3',
          borderRadius: '100px',
          padding: '0px 20px',
        }}
        onChange={onChangeKeyword}
      />
      {dataListView()}
    </div>
  );

  function dataListView() {
    if (isLoading) {
      return <div className="h-[calc(52vh)]">{loadingView()}</div>;
    }
    if (isEmpty) {
      return emptyDataTips();
    }

    return (
      <div
        className="overflow-y-auto h-[calc(55vh)]"
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

  function itemDiv(item: PageSpaceMemberInfo) {
    return (
      <div
        className="py-5 flex items-center border-b-[1px] mb-[10px] border-border px-[10px]"
        key={item.id}
      >
        <div className="flex-1 overflow-hidden text-first">
          <div className="flex items-center">
            <span className="h-[18px] text-[14px] flex items-center">
              {userRole(item.role).roleText}
            </span>
          </div>
          <div className="text-[20px] font-medium leading-6 overflow-hidden w-[calc(100%-40px)] whitespace-nowrap text-ellipsis mt-[15px] flex items-center gap-[6px]">
            {userFace(item.faceUrl, 'w-[30px] h-[30px] ')}{' '}
            {item.username || '-'}
          </div>
          <div className="mt-[6px]">{item.email || '-'}</div>
          <div className="mt-[6px] text-third">
            {userRole(item.role).roleDes}
          </div>
        </div>
        {(item.role === 20 || (spaceDetail?.role === 0 && item.role !== 0)) && (
          <PopoverPro
            items={
              [
                item?.role !== 10
                  ? {
                      text: (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          onClick={() => changeUserRole(item.id, 10)}
                        >
                          {t('clientUI.spaceSetting.users.setAdmin')}
                        </div>
                      ),
                    }
                  : {
                      text: (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          onClick={() => changeUserRole(item.id, 20)}
                        >
                          {t('clientUI.spaceSetting.users.remove')}
                        </div>
                      ),
                    },
                {
                  text: (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      onClick={() => banUser(item.id)}
                    >
                      {t('clientUI.spaceSetting.users.kick')}
                    </div>
                  ),
                },
              ].filter(Boolean) as {
                text: string | ReactNode;
              }[]
            }
            trigger="hover"
            placement="bottom"
          >
            <div className="border-border cursor-pointer border h-10 flex items-center rounded-[20px] px-3 text-first">
              {t('clientUI.spaceSetting.users.editAccess')}
              <DownIcon className="ml-[10px]" />
            </div>
          </PopoverPro>
        )}
      </div>
    );
  }
};
export default AllMembers;
