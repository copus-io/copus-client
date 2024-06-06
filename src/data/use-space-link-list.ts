import { useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import { fetch } from '../fetch/intercept';

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
export function useExternalLinksReq(spaceId: string) {
  return useSWR(
    spaceId ? ['/client/common/space/externalLinks', spaceId] : null,
    ([url, spaceId]) =>
      fetch
        .get<ApiResData<SpaceExternalLinkInfo[]>>(url, {
          headers: {
            spaceInfo: JSON.stringify({ namespace: spaceId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}

/**
 * SpaceMemberInfo
 */
export interface SpaceMemberInfo {
  /**
   * 邮箱 唯一
   */
  email: string;
  /**
   * 头像
   */
  faceUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * seeDao的sns
   */
  seeDaoName: string;
  namespace: string;
  /**
   * 用户名 昵称
   */
  username: string;
  /**
   * 钱包地址 唯一
   */
  walletAddress: string;
  [property: string]: any;
}

/** 空间links */

/** 空间额外链接 */
export function useSpaceMemberInfoReq(spaceId: string) {
  return useSWR(
    spaceId ? ['/client/common/space/adminList', spaceId] : null,
    ([url, spaceId]) =>
      fetch
        .get<ApiResData<SpaceMemberInfo[]>>(url, {
          headers: {
            spaceInfo: JSON.stringify({ namespace: spaceId }),
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
   * spaceId
   */
  spaceId?: number;
  /**
   * 空间名称
   */
  spaceName?: string;
  [property: string]: any;
}
/** 空间投递作品 */

export function useSpaceSubmittedPageReq(params: Request, spaceId: string) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? [
            '/client/user/space/opus/manage/submittedPage',
            index + 1,
            params,
            spaceId,
          ]
        : null;
    },
    ([url, pageIndex, params, spaceId]) =>
      fetch
        .get<ApiResData<PagingResData<InviteOrSubmitItemInfo>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            spaceInfo: JSON.stringify({ namespace: spaceId }),
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
