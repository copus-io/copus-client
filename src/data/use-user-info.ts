import { useMemo, useState } from 'react';
import { UserInfo } from 'src/api/user';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import UserSimpleInfo from './user-simpleInfo-model';

/** user */
export default function useUserInfoReq() {
  return useSWR('/client/user/userInfo', (url) =>
    fetch.get<ApiResData<UserInfo>>(url).then((res) => {
      return res.data.data;
    })
  );
}

export interface NotificationPageReq {
  /**
   * onlyUnread
   */
  onlyUnread?: boolean;
  /**
   * 当前页码
   */
  pageIndex?: number;
  /**
   * 每页显示记录数
   */
  pageSize?: number;
  [property: string]: any;
}

/**
 * ClientUserNotificationInfo
 */
export interface ClientUserNotificationInfo {
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * id
   */
  id?: number;
  /**
   * 已读
   */
  isRead?: boolean;
  /**
   * 消息模版编号
   */
  templateCode?: number;
  userInfo?: UserSimpleInfo;
  /**
   * 模版对应的参数值
   */
  value?: string;
  [property: string]: any;
}

export function useUserNotificationPageReq(params: NotificationPageReq) {
  const [total, setTotal] = useState(0);

  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/msg/page', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<ClientUserNotificationInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
        })
        .then((res) => {
          setTotal(res.data.data?.totalRecords || 0);
          return res.data.data?.data || [];
        }),
    {
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  );

  const result = useMemo(() => {
    return {
      ...data,
      total,
    };
  }, [data, total]);
  return result;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export async function userUnreadMsgCount() {
  const resp = await fetch.get<ApiResData<NotificationCountInfo>>(
    '/client/user/msg/unreadMsgCount'
  );
  if (resp && resp.data.status === 1) {
    return resp.data.data.unreadCount;
  }
  return 0;
}

export async function userNotificationPageReq(params: NotificationPageReq) {
  const resp = await fetch.get<
    ApiResData<PagingResData<ClientUserNotificationInfo>>
  >('/client/user/msg/page', {
    params: {
      ...params,
    },
  });

  if (resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}
