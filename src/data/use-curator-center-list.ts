import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo, useState } from 'react';
import { CreationForHome } from './use-creation-list';

export interface BasePageReq {
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
 * OpusSubmitSpaceInfo
 */
export interface OpusSubmitSpaceInfo {
  creation?: CreationForHome;
  /**
   * 当前状态：0：已发送，等待回复，10：同意，20：拒绝
   */
  currState?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 是否已读
   */
  isRead?: boolean;
  /**
   * 给策展人的留言
   */
  message?: string;
  [property: string]: any;
}

/**
 * 投递到我的空间的作品
 * @param params
 * @returns
 */
export default function useSubmissionToSpaceListReq(
  params: BasePageReq,
  namespace: string
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? [
            '/client/user/space/opus/manage/submittedPage',
            index + 1,
            params,
            namespace,
          ]
        : null;
    },
    ([url, pageIndex, params, namespace]) =>
      fetch
        .get<ApiResData<PagingResData<OpusSubmitSpaceInfo>>>(url, {
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

export async function newSubmissionToSpaceListReq(
  params: BasePageReq,
  namespace: string
) {
  const url = '/client/user/space/opus/manage/submittedPage';
  const resp = await fetch.get<ApiResData<PagingResData<OpusSubmitSpaceInfo>>>(
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
