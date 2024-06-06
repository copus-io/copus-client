import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { CreationForSpaceHome } from './use-creation-list';

interface CreationForHomeListParams {
  /**
   * 类型： -1:all;0:space;1:opus
   */
  cardType?: number;
  /**
   * 作者id
   */
  createBy?: number;
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
  /**
   * 排序类型：0：Most Recent，10:Most Popular，20：Most Inspiring
   */
  sortBy?: number;
}

/** 空间列表 */
export default function useSpaceCreationListReq(
  params: CreationForHomeListParams,
  namespace: string
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/common/space/opusPage', index + 1, params, namespace]
        : null;
    },
    ([url, pageIndex, params, namespace]) =>
      fetch
        .get<ApiResData<PagingResData<CreationForSpaceHome>>>(url, {
          params: {
            ...params,
            pageIndex,
          },
          headers: {
            spaceInfo: JSON.stringify({ namespace }),
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

export async function spaceOpusListReq(
  params: CreationForHomeListParams,
  namespace: string
) {
  const url = '/client/common/space/opusPage';
  const resp = await fetch.get<ApiResData<PagingResData<CreationForSpaceHome>>>(
    url,
    {
      params,
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );

  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}
