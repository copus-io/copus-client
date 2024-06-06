import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
import { OpusTagInfo } from './use-work-detail';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * OpusCardInfo
 */
export interface OpusCardInfo {
  /**
   * 封面图
   */
  coverUrl?: string;
  /**
   * 状态：0，草稿，10：发布
   */
  currState?: number;
  /**
   * id
   */
  id: number;
  /**
   * 作品类型
   */
  opusType?: number;
  /**
   * 分润比例
   */
  ratio?: number;

  /**
   * 打赏的总金额
   */
  rewardAmount?: number;
  /**
   * 摘要
   */
  subTitle?: string;
  /**
   * tag
   */
  tagInfos?: OpusTagInfo[];
  /**
   * 标题
   */
  title: string;
  userInfo?: UserSimpleInfo;
  /**
   * uuid
   */
  uuid?: string;
}

/** 启发上游 */
export default function useInspiredVOListReq(
  /**
   * 类型:0:all，1:最近浏览，2:我的作品
   */
  type?: number,
  /**
   * 已经选中的上游文章id,逗号分割
   */
  existIds?: string,
  /**
   * 关键字，为空时，获取全部
   */
  keyword?: string,
  /**
   * 当前文章的uuid
   */
  uuid?: string
) {
  return useSWR(
    ['/client/user/opus/creator/searchUpstream', uuid, keyword, existIds, type],
    ([url, uuid, keyword, existIds]) =>
      fetch
        .get<ApiResData<OpusCardInfo[]>>(url, {
          params: {
            type,
            uuid,
            keyword,
            existIds,
          },
          headers: {
            // cascadeInfo: JSON.stringify({ cascadeId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
