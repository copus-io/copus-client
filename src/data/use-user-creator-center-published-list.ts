import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { BasePageReq } from './use-curator-center-list';
import { SpaceMetaInfo } from './use-opus-inSpaces-list';
import { KeywordPageReq } from './use-user-creator-center-spaces-list';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * OpusInfoForPublished
 */
export interface OpusInfoForPublished {
  /**
   * 操作等级：0：公开（空间：开放，作品：公开）：10：专属空间，20：私密空间（作品：私享）
   */
  accessLevel?: number;

  opusType?: number;
  /**
   * 评论总条数
   */
  commentCount?: number;
  /**
   * 封面图
   */
  coverUrl?: string;
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
   * 发布时间 yyyy-MM-dd HH:mm
   */
  publishTime?: number;
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
  spaceInfos?: SpaceMetaInfo[];
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

/** 已经发布的作品列表 opus/published */
export default function useCreatorCenterPublishedListReq(
  params: KeywordPageReq
) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/user/creator/center/opus/published', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<OpusInfoForPublished>>>(url, {
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

/** 已被邀请的读者s invitedReaders */
export function useOpusInvitedReaders(params: BasePageReq, opusId: number) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? [
            '/client/user/creator/center/opus/invitedReaders',
            index + 1,
            params,
            opusId,
          ]
        : null;
    },
    ([url, pageIndex, params, opusId]) =>
      fetch
        .get<ApiResData<PagingResData<UserSimpleInfo>>>(url, {
          params: {
            ...params,
            opusId,
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
