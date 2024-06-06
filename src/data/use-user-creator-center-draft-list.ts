import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { KeywordPageReq } from './use-user-creator-center-spaces-list';

/**
 * OpusInfoForDraft
 */
export interface OpusInfoForDraft {
  /**
   * 封面图
   */
  coverUrl?: string;
  /**
   * 最后编辑时间 yyyy-MM-dd HH:mm
   */
  editTime?: Date;
  /**
   * id
   */
  id?: number;

  opusType?: number;

  /**
   * 标题
   */
  title?: string;
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

/** 草稿列表 opus/draft */
export default function useCreatorCenterDraftListReq(
  params: KeywordPageReq,
  userId?: string
) {
  const [total, setTotal] = useState(0);

  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/creator/center/opus/draft', index + 1, params, userId]
        : null;
    },
    ([url, pageIndex, params, userId]) =>
      fetch
        .get<ApiResData<PagingResData<OpusInfoForDraft>>>(url, {
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
      revalidateFirstPage: true,
      revalidateOnMount: true,
    }
  );

  return {
    ...data,
    total,
  };
}

export async function creatorCenterDraftListReq(
  params: KeywordPageReq,
  userId?: string
) {
  const resp = await fetch.get<ApiResData<PagingResData<OpusInfoForDraft>>>(
    '/client/user/creator/center/opus/draft',
    {
      params: {
        ...params,
      },
      headers: {
        userSpace: JSON.stringify({ namespace: userId }),
      },
    }
  );

  if (resp.data.status === 1) {
    return resp.data.data;
  }
  return null;
}
