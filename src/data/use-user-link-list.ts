import { useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import { fetch } from '../fetch/intercept';
import { SpaceMemberInfo } from './use-space-link-list';

/**
 * SpaceExternalLinkInfo
 */
export interface SpaceExternalLinkInfo {
  /**
   * 图片url
   */
  iconUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 链接
   */
  link: string;
  /**
   * 名称
   */
  name: string;
  [property: string]: any;
}

/** 空间links */

/** 空间额外链接 */
export function useExternalLinksReq(userId: string) {
  return useSWR(
    userId ? ['/client/common/user/home/externalLinks', userId] : null,
    ([url, userId]) =>
      fetch
        .get<ApiResData<SpaceExternalLinkInfo[]>>(url, {
          headers: {
            userSpace: JSON.stringify({ namespace: userId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}

/** 空间links */

/** 空间额外链接 */
export function useSpaceMemberInfoReq(userId: string) {
  return useSWR(
    userId ? ['/client/common/space/adminList', userId] : null,
    ([url, userId]) =>
      fetch
        .get<ApiResData<SpaceMemberInfo[]>>(url, {
          headers: {
            spaceInfo: JSON.stringify({ namespace: userId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}

interface Request {
  /**
   * 当前状态：不传：全部， 0：已发送，等待回复，10：同意，20：拒绝
   */
  currState?: number;
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
 * Page«InviteOrSubmitItemInfo»
 */
export interface PageInviteOrSubmitItemInfo {
  data?: InviteOrSubmitItemInfo[];
  /**
   * 最后一条数据的id
   */
  lastId?: number;
  /**
   * 总共页数
   */
  pageCount: number;
  /**
   * 当前页码
   */
  pageIndex: number;
  /**
   * 每页显示记录数
   */
  pageSize: number;
  /**
   * 查询结果总记录数
   */
  totalRecords: number;
  [property: string]: any;
}

/**
 * InviteOrSubmitItemInfo
 */
export interface InviteOrSubmitItemInfo {
  /**
   * 时间
   */
  createTime?: Date;
  /**
   * 当前状态：0：已发送，等待回复，10：同意，20：拒绝
   */
  currState?: number;
  /**
   * id
   */
  id?: number;
  /**
   * opusId
   */
  opusId?: number;
  /**
   * 文章标题
   */
  opusTitle?: string;
  /**
   * userId
   */
  userId?: number;
  /**
   * 空间名称
   */
  spaceName?: string;
  [property: string]: any;
}
/** 空间投递作品 */

export function useSpaceSubmittedPageReq(params: Request, userId: string) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? [
            '/client/user/space/opus/manage/submittedPage',
            index + 1,
            params,
            userId,
          ]
        : null;
    },
    ([url, pageIndex, params, userId]) =>
      fetch
        .get<ApiResData<PagingResData<InviteOrSubmitItemInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            spaceInfo: JSON.stringify({ namespace: userId }),
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
