import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteMessageReq, readMessageReq } from 'src/api/user';
import { ReactComponent as DeleteIcon } from 'src/assets/media/svg2/ic-delete.svg';
import {
  emptyDataTips,
  listViewLoadMore,
  loadingView,
  userFace,
} from 'src/components/common';
import {
  ClientUserNotificationInfo,
  userNotificationPageReq,
} from 'src/data/use-user-info';
import { formatTimestamp } from 'src/utils/common';
import { publish } from 'src/utils/event';

const pageSize = 10;

export default function NotificationView() {
  const { t } = useTranslation();
  const router = useRouter();
  const [containerRef, setContainerRef] = useState<any>();
  const [dataList, setDataList] = useState<ClientUserNotificationInfo[]>([]);

  const [fresh, setFresh] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [onlyUnread, setOnlyUnread] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReachingEnd, setIsReachingEnd] = useState(true);

  useEffect(() => {
    userNotificationPageReq({
      pageSize: pageSize,
      pageIndex: pageIndex,
      onlyUnread: onlyUnread ? true : undefined,
    }).then((resp) => {
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
  }, [fresh, pageIndex, onlyUnread]);

  let isEmpty = false;
  if (!isLoading && dataList.length === 0) {
    isEmpty = true;
  }

  function loadMoreData() {
    setPageIndex(pageIndex + 1);
  }

  return (
    <div className="px-[20px] ">
      <div className="flex items-center justify-between mr-[20px] pt-[20px]">
        <div className="text-[25px] font-[500] text-[#231f20]">
          {t('clientUI.notification.name')} ({dataList.length}/{total})
        </div>
        <div className="flex gap-[20px]">
          <button
            onClick={async () => {
              await readMessageReq({ id: 0 });
              publish('freshMsgCount');
              dataList.map((item) => {
                item.isRead = true;
              });
              setFresh(fresh + 1);
            }}
            className="px-[15px] py-[8px] bg-white border border-solid border-[#000] rounded-full text-[15px]"
          >
            {t('clientUI.notification.markAllRead')}
          </button>
          <button
            onClick={() => {
              setOnlyUnread(!onlyUnread);
              setPageIndex(1);
            }}
            className="px-[15px] py-[8px] w bg-white border border-solid border-[#000] rounded-full text-[15px]"
          >
            <div className="px-[10px]">
              {onlyUnread
                ? t('clientUI.notification.all')
                : t('clientUI.notification.onlyUnread')}
            </div>
          </button>
        </div>
      </div>
      {dataView()}
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
        className="h-[calc(65vh)] pt-[10px] overflow-y-auto"
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

  function itemDiv(item: ClientUserNotificationInfo) {
    return (
      <div
        onClick={async () => {
          if (item.isRead === false) {
            await readMessageReq({ id: item.id! });
            item.isRead = true;
            publish('freshMsgCount');
          }
        }}
        key={item.id}
        className=" hover:bg-[#bdbaba42] py-[30px] border-b-[1px] border-dash border-[#eee]"
      >
        <div className="flex justify-between mb-[5px]  mr-[20px]">
          <div
            onClick={() => {
              router.push('user/' + item.userInfo?.namespace!);
            }}
            className="flex items-center cursor-pointer gap-[5px]"
          >
            {item.isRead ? (
              <div className="w-[12px]"></div>
            ) : (
              <div className="w-[12px] h-[12px] rounded-[50%] bg-[#f22c00]"></div>
            )}
            {userFace(item.userInfo?.faceUrl!, 'w-[20px] h-[20x]')}
            <div>{item.userInfo?.username}</div>
          </div>
          <div>{formatTimestamp(item.createTime as any)}</div>
        </div>

        <div className="ml-[16px] flex justify-between items-center mr-[20px]">
          <div>{getItemByType(item)}</div>
          <DeleteIcon
            className="cursor-pointer"
            onClick={async (e) => {
              e.stopPropagation();

              await deleteMessageReq({ id: item.id! });
              const newArr = dataList.filter((value) => value.id !== item.id);
              setDataList(newArr);
              let leftTotal = total - 1;
              setTotal(leftTotal);
              if (newArr.length < pageSize && leftTotal > newArr.length) {
                setFresh(fresh + 1);
              }
              publish('freshMsgCount');
            }}
          ></DeleteIcon>
        </div>
      </div>
    );
  }

  function getItemByType(item: ClientUserNotificationInfo) {
    let code = item.templateCode;
    let dataArr = item.value!.split(',');

    let clsName = 'text-[black] font-[600] underline';

    // A new post {作品名+作品超链接} is live in {空间名+空间超链接}!
    if (code === 2020) {
      return (
        <div>
          A new post{' '}
          <a
            className={clsName}
            href={'/work/' + decodeURIComponent(dataArr[3])}
            target="blank"
          >
            {decodeURIComponent(dataArr[2])}
          </a>{' '}
          is live in{' '}
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>
        </div>
      );
    }

    // Your post {作品名+作品超链接} is live in {空间名+空间超链接}!
    if (code === 1010) {
      return (
        <div>
          Your post{' '}
          <a
            className={clsName}
            href={'/work/' + decodeURIComponent(dataArr[3])}
            target="blank"
          >
            {decodeURIComponent(dataArr[2])}
          </a>{' '}
          is live in{' '}
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>
        </div>
      );
    }
    // Your submission {作品名+作品超链接} to {空间名+空间超链接} is rejected.
    if (code === 1020) {
      return (
        <div>
          Your submission{' '}
          <a
            className={clsName}
            href={'/work/' + decodeURIComponent(dataArr[3])}
            target="blank"
          >
            {decodeURIComponent(dataArr[2])}
          </a>{' '}
          to{' '}
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>{' '}
          is rejected.
        </div>
      );
    }

    // Your space {空间名+空间超链接} received {a new submission+对应空间策展中心超链接}!
    if (code === 2010) {
      return (
        <div>
          Your space{' '}
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>{' '}
          received a new submission
        </div>
      );
    }

    // {空间名+空间超链接} has changed its space tax rate.
    if (code === 2030) {
      return (
        <div>
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>{' '}
          has changed its space tax rate.
        </div>
      );
    }
    // {空间名} is deleted by its creator.
    if (code === 2031) {
      return (
        <div>{decodeURIComponent(dataArr[0])} is deleted by its creator.</div>
      );
    }

    // {作者用户名+个人主页超链接} created a new post {作品名+作品超链接}!
    if (code === 2050) {
      return (
        <div>
          Created a new post{' '}
          <a
            className={clsName}
            href={'/work/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>
        </div>
      );
    }

    // {用户名+个人主页超链接} liked your post {作品名+作品超链接}.
    if (code === 1103) {
      return (
        <div>
          Liked a new post{' '}
          <a
            className={clsName}
            href={'/work/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>
        </div>
      );
    }
    // {用户名+个人主页超链接} joined your space {空间名+空间超链接}.
    if (code === 2060) {
      return (
        <div>
          Joined your space{' '}
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>
        </div>
      );
    }
    // 获得{水滴数}
    if (code === 1200) {
      return (
        <div>
          获得 <span>{decodeURIComponent(dataArr[0])}</span>
          {' 水滴'}
        </div>
      );
    }

    // {作品名+作品超链接} has a new branch {分叉作品名+作品超链接}!
    if (code === 2040) {
      return (
        <div>
          <a
            className={clsName}
            href={'/work/' + decodeURIComponent(dataArr[1])}
            target="blank"
          >
            {decodeURIComponent(dataArr[0])}
          </a>{' '}
          has a new branch{' '}
          <a
            className={clsName}
            href={'/' + decodeURIComponent(dataArr[3])}
            target="blank"
          >
            {decodeURIComponent(dataArr[2])}
          </a>
        </div>
      );
    }

    return (
      <div>
        {decodeURIComponent(item.value!)} {code}
      </div>
    );
  }
}
