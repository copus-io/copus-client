import { useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { OpusTagInfo } from './use-work-detail';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * CreationForSpaceHome
 */
export interface CreationForSpaceHome {
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 创建时间 yyyy-MM-dd HH:mm
   */
  createTime?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 作品类型
   */
  opusType?: number;
  /**
   * 扩展字段：作品：点赞和评论(likeCount,commentCount)，空间：logoUrl
   */
  otherInfos?: { [key: string]: any };
  /**
   * 被打赏的数量（空间税收的收入，单个作品打赏的收入）
   */
  rewardAmount?: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标题
   */
  title: string;

  isFeatured: boolean;

  userInfo: UserSimpleInfo;

  tagInfos?: OpusTagInfo[];
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

/**
 * CreationForHome
 */
export interface CreationForHome {
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 创建时间 yyyy-MM-dd HH:mm
   */
  createTime?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 作品类型
   */
  opusType?: number;
  /**
   * 扩展字段：作品：点赞和评论(likeCount,commentCount)，空间：logoUrl
   */
  otherInfos?: { [key: string]: any };
  /**
   * 被打赏的数量（空间税收的收入，单个作品打赏的收入）
   */
  rewardAmount?: number;

  downstreamCount?: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标题
   */
  title: string;
  userInfo: UserSimpleInfo;
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

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
export default function useCreationListReq(params: CreationForHomeListParams) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? ['/client/home/creationPage', index + 1, params]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<CreationForHome>>>(url, {
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
      revalidateOnMount: false,
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
