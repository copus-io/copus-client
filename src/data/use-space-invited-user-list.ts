import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * Page«UserSimpleInfo»
 */
export interface PageUserSimpleInfo {
  data?: UserSimpleInfo[];
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

export interface Request {
  /**
   * 搜索的关键字
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
// 私密空间 被邀请进入空间（还没有被用户同意的）的用户列表
export default function useUserInvitedToSpacePageReq(
  params: Request,
  spaceId: string
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return [
        '/client/user/space/manage/userInvitedToSpacePage',
        index + 1,
        params,
        spaceId,
      ];
    },
    ([url, pageIndex, params, spaceId]) =>
      fetch
        .get<ApiResData<PagingResData<UserSimpleInfo>>>(url, {
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
export async function userInvitedToSpacePageReq(
  params: Request,
  spaceId: string
) {
  const url = '/client/user/space/manage/userInvitedToSpacePage';
  const resp = await fetch.get<ApiResData<PagingResData<UserSimpleInfo>>>(url, {
    params,
    headers: {
      spaceInfo: JSON.stringify({ namespace: spaceId }),
    },
  });

  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}

/**
 * UserInfoForApplyJoinSpace
 */
export interface UserInfoForApplyJoinSpace {
  /**
   * 创建时间 yyyy-MM-dd HH:mm
   */
  createTime?: Date;
  /**
   * 当前状态：0：发起申请，10：通过，20：拒绝
   */
  currState?: number;
  /**
   * id
   */
  id?: number;
  userInfo?: UserSimpleInfo;
  [property: string]: any;
}

export function useUserApplyMemberPageReq(params: Request, spaceId: string) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return [
        '/client/user/space/manage/applyMemberPage',
        index + 1,
        params,
        spaceId,
      ];
    },
    ([url, pageIndex, params, spaceId]) =>
      fetch
        .get<ApiResData<PagingResData<UserInfoForApplyJoinSpace>>>(url, {
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

export async function userApplyMemberPageReq(params: Request, spaceId: string) {
  const url = '/client/user/space/manage/applyMemberPage';

  const resp = await fetch.get<
    ApiResData<PagingResData<UserInfoForApplyJoinSpace>>
  >(url, {
    params,
    headers: {
      spaceInfo: JSON.stringify({ namespace: spaceId }),
    },
  });

  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}
