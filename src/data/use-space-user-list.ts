import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { SpaceMemberInfo } from './use-space-link-list';

/**
 * Page«SpaceMemberInfo»
 */
export interface PageSpaceMemberInfo {
  data?: SpaceMemberInfo[];
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

interface SpaceUserListParams {
  /**
   * 每页显示记录数
   */
  pageSize: number;

  pageIndex: number;
  /**
   * 搜索的关键字
   */
  keyword?: string;
  /**
   * 在空间中的角色：0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role?: number;
}
export default function useSpaceUserListReq(
  params: SpaceUserListParams,
  spaceId: string
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return [
        '/client/user/space/manage/member/page',
        index + 1,
        params,
        spaceId,
      ];
    },
    ([url, pageIndex, params, spaceId]) =>
      fetch
        .get<ApiResData<PagingResData<PageSpaceMemberInfo>>>(url, {
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
export async function spaceUserListReq(
  params: SpaceUserListParams,
  spaceId: string
) {
  const url = '/client/user/space/manage/member/page';
  const resp = await fetch.get<ApiResData<PagingResData<PageSpaceMemberInfo>>>(
    url,
    {
      params,
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );

  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}
