import { useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { KeywordPageReq } from './use-user-creator-center-spaces-list';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * UserSpaceInfo
 */
export interface UserSpaceInfo {
  /**
   * 个人描述
   */
  bio?: string;
  /**
   * 封面图url
   */
  coverUrl?: string;
  /**
   * 邮箱 唯一
   */
  email?: string;
  /**
   * 头像
   */
  faceUrl?: string;
  /**
   * id
   */
  id?: number;
  /**
   * 流入量
   */
  inStream?: number;
  /**
   * 空间别名
   */
  namespace?: string;
  /**
   * 流出量
   */
  outStream?: number;
  /**
   * seeDao的sns
   */
  seeDaoName: string;
  seedaoAlias: boolean;

  canEdit: boolean;

  spaceData?: UserSpaceData;
  /**
   * token的数量
   */
  tokenAmount?: number;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 钱包地址 唯一
   */
  walletAddress?: string;
  [property: string]: any;
}

/**
 * UserSpaceData
 */
export interface UserSpaceData {
  /**
   * 我被多少用户关注的总量，我的粉丝量
   */
  followedCount?: number;
  /**
   * 我关注用户的总量，我正在关注的用户量
   */
  followingCount?: number;
  /**
   * 我是否关注了这个空间
   */
  isFollowing?: boolean;
  /**
   * opus总量
   */
  opusCount?: number;
  /**
   * space总量
   */
  spaceCount?: number;
  [property: string]: any;
}

/** 用户主页的基础信息 */
export default function useUserHomeDetailReq(userId: string) {
  return useSWR(
    userId ? ['/client/common/user/home/spaceInfo', userId] : null,
    ([url, userId]) =>
      fetch
        .get<ApiResData<UserSpaceInfo>>(url, {
          headers: {
            userSpace: JSON.stringify({ namespace: userId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}

/**
 *
 * @param params 用户的粉丝
 * @returns
 */
export function usePageUserFollowers(params: KeywordPageReq, userId: string) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/common/user/home/pageFollowed', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<UserSimpleInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            userSpace: JSON.stringify({ namespace: userId }),
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
 * 用户关注的用户的
 */
export function usePageUserFollowings(params: KeywordPageReq, userId: string) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/common/user/home/pageMyFollowing', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<UserSimpleInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            userSpace: JSON.stringify({ namespace: userId }),
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
