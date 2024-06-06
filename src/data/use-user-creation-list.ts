import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';
import { CreationForHome } from './use-creation-list';

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
export default function useUserCreationListReq(
  params: CreationForHomeListParams,
  userId: string
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/common/user/home/creationPage', index + 1, params, userId]
        : null;
    },
    ([url, pageIndex, params, userId]) =>
      fetch
        .get<ApiResData<PagingResData<CreationForHome>>>(url, {
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
