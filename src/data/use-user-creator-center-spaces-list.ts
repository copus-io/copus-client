import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';
import { SpaceMetaInfo } from './use-opus-inSpaces-list';
import UserSimpleInfo from './user-simpleInfo-model';

export interface KeywordPageReq {
  /**
   * keyword
   */
  keyword?: string;
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
 * SpaceInviteInfo
 */
export interface SpaceInviteInfo {
  /**
   * 状态：0：待确认，10：同意，20：拒绝
   */
  currState?: number;
  /**
   * id
   */
  id: number;
  /**
   * 邀请消息
   */
  message: string;
  spaceInfo?: SpaceMetaInfo;
  userInfo?: UserSimpleInfo;
  [property: string]: any;
}

/**
 * 我创建的空间列表
 * @param params
 * @returns
 */
export function useCreatorCenterMyCreatedSpaceListReq(params: KeywordPageReq) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/creator/center/space/myCreated', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<SpaceMetaInfo>>>(url, {
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

/**
 * 我加入的空间列表
 */
export function useCreatorCenterMyJoinedSpaceListReq(params: KeywordPageReq) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/creator/center/space/myJoined', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<SpaceMetaInfo>>>(url, {
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

export async function creatorCenterMyJoinedSpaceListReq(
  params: KeywordPageReq
) {
  const url = '/client/user/creator/center/space/myJoined';
  const resp = await fetch.get<ApiResData<PagingResData<SpaceMetaInfo>>>(url, {
    params,
  });

  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}

/**
 * 被邀请的空间列表
 */
export function useCreatorCenterInvitingListReq(params: KeywordPageReq) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/creator/center/space/invited', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<SpaceInviteInfo>>>(url, {
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

export async function creatorCenterInvitingListReq(params: KeywordPageReq) {
  const url = '/client/user/creator/center/space/invited';
  const resp = await fetch.get<ApiResData<PagingResData<SpaceInviteInfo>>>(
    url,
    { params }
  );
  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}
