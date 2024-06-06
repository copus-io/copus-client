import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { SpaceMetaInfo } from './use-opus-inSpaces-list';
import { KeywordPageReq } from './use-user-creator-center-spaces-list';

/**
 * OpusInfoForSubmission
 */
export interface OpusInfoForSubmission {
  /**
   * 评论总条数
   */
  commentCount?: number;
  /**
   * 封面图
   */
  coverUrl?: string;
  /**
   * 发布时间 yyyy-MM-dd HH:mm
   */
  createTime?: number;
  /**
   * 当前状态：0：已发送，等待回复，10：同意，20：拒绝
   */
  currState?: number;
  /**
   * 下游作品的数量
   */
  downstreamCount?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 点赞数量
   */
  likeCount?: number;
  /**
   * 阅读量
   */
  readCount?: number;
  /**
   * 被打赏的数量（空间税收的收入，单个作品打赏的收入）
   */
  rewardAmount?: number;
  /**
   * 分享数量
   */
  shareCount?: number;
  spaceInfo?: SpaceMetaInfo;
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

/** 我投递过的列表 submissionPage */
export default function useCreatorCenterSubmissionListReq(
  params: KeywordPageReq
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/creator/center/opus/submission', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<OpusInfoForSubmission>>>(url, {
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

export async function creatorCenterSubmissionListReq(params: KeywordPageReq) {
  const url = '/client/user/creator/center/opus/submission';
  const resp = await fetch.get<
    ApiResData<PagingResData<OpusInfoForSubmission>>
  >(url, {
    params,
  });
  if (resp && resp.data.status === 1) {
    return resp.data.data;
  }

  return null;
}
