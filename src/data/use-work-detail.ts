import { UpstreamOpus } from 'src/api/createOpus';
import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
import UserSimpleInfo from './user-simpleInfo-model';

export interface OpusInfo {
  /**
   * 内容
   */
  content?: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 状态：0，草稿，10：发布
   */
  currState?: number;
  /**
   * 下游作品的数量
   */
  downstreamCount?: number;
  /**
   * id
   */
  id: number;
  /**
   * 是否点赞过
   */
  isLike?: boolean;
  /**
   * 点赞数量
   */
  likeCount?: number;
  /**
   * 作品类型
   */
  opusType?: number;
  /**
   * 分润比例
   */
  ratio?: number;
  /**
   * 阅读量
   */
  readCount?: number;
  /**
   * 被打赏的数量
   */
  rewardAmount?: number;
  /**
   * 分享数量
   */
  shareCount?: number;
  /**
   * 被多少个空间收录
   */
  spaceCount?: number;

  /**
   * 评论数
   */
  commentCount?: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * tag
   */
  tagInfos?: OpusTagInfo[];
  /**
   * 标题
   */
  title: string;
  /**
   * 上游作品的数量
   */
  upstreamCount?: number;
  userInfo: UserSimpleInfo;
  /**
   * uuid
   */
  uuid: string;
  arId: string;
  fractArId: string;
  publishTime: string;
}

/**
 * OpusTagInfo
 */
export interface OpusTagInfo {
  /**
   * id
   */
  id: number;
  /**
   * tag名称
   */
  tag: string;
  /**
   * 背景色
   */
  tagColor: string;
}

/** 文章详情 */
export function useOpusDetailReq(uuid: string) {
  return useSWR(uuid ? [`/client/common/opus/detail/${uuid}`] : null, ([url]) =>
    fetch.get<ApiResData<OpusInfo>>(url, {}).then((res) => {
      return res.data.data;
    })
  );
}

export interface OpusForEditInfo {
  /**
   * 内容
   */
  content: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 上游列表
   */
  upstreamOpusList: OpusUpstreamInfo[];
  /**
   * uuid
   */
  uuid: string;
  [property: string]: any;
}

/**
 * OpusUpstreamInfo
 */
export interface OpusUpstreamInfo extends UpstreamOpus {
  /**
   * 创建人id
   */
  createBy?: number;
  /**
   * 创建人
   */
  creatorName?: string;
  /**
   * uuid
   */
  uuid: string;
  [property: string]: any;
}

export function useOpusDraftDetailReq(uuid: string) {
  return useSWR(
    uuid ? [`/client/user/opus/creator/draftDetail`, uuid] : null,
    ([url, uuid]) =>
      fetch
        .get<ApiResData<OpusForEditInfo>>(url, { params: { uuid: uuid } })
        .then((res) => {
          return res.data.data;
        }),
    {
      revalidateFirstPage: false,
      revalidateOnMount: false,
      refreshInterval: 0,
    }
  );
}
