import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';
import { SpaceMetaInfo } from './use-opus-inSpaces-list';

export interface SpacesCanSubmitRequest {
  /**
   * 当前页码
   */
  pageIndex?: number;
  /**
   * 每页显示记录数
   */
  pageSize?: number;
  /**
   * uuid
   */
  uuid?: string;
  keyword?: string;
}

/** 可投递空间列表 */
export default function useSpacesCanSubmitListReq(
  params: SpacesCanSubmitRequest
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? [
            '/client/user/creator/center/opus/spacesCanBeSubmitted',
            index + 1,
            params,
          ]
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
