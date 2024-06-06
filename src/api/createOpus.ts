import { fetch } from 'src/fetch/intercept';

/**
 * OpusEditReq
 */
export interface CreateOpusReqParams {
  /**
   * 操作等级：0：公开：20：私享
   */
  accessLevel?: number;
  /**
   * 内容
   */
  content: string;
  /**
   * 封面图
   */
  coverUrl?: string;
  /**
   * 邀读邮箱列表
   */
  emails?: string[];
  /**
   * 类型: 10：文字，20：图片，30：音频，40：视频，50：混合
   */
  opusType?: number;
  /**
   * 邀读用户列表
   */
  readers?: number[];
  /**
   * 是否发布到链上
   */
  storeOnChain?: boolean;
  /**
   * 摘要
   */
  subTitle?: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 上游作品
   */
  upstreamList?: UpstreamOpus[];
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

/**
 * UpstreamOpusReq
 */
export interface UpstreamOpus {
  /**
   * 比例
   */
  ratio: number;
  /**
   * 上游作品id
   */
  upstreamOpusId: number;
  [property: string]: any;
}

/**
 * OpusPublishResp
 */
export interface OpusPublish {
  /**
   * id
   */
  id?: number;
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

/** 发布文章 */
export function publishOpusReq(
  params: CreateOpusReqParams,
  namespace?: string
) {
  return fetch.post<ApiResData<OpusPublish>>(
    '/client/user/opus/creator/publish',
    params,
    namespace
      ? {
          headers: {
            spaceInfo: JSON.stringify({ namespace }),
          },
        }
      : {}
  );
}

/** 存为草稿文章 */
export function saveDraftOpusReq(params: CreateOpusReqParams) {
  return fetch.post<ApiResData<string>>(
    '/client/user/opus/creator/saveDraft',
    params,
    {
      headers: {
        // cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}
