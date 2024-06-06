import type { CommentList } from 'src/data/use-article-comment-list';
import type { PieceDetailData } from 'src/data/use-piece-detail';
import { fetch } from 'src/fetch/intercept';

export interface AddOrEditData {
  /**
   * 内容
   */
  content: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 状态：0，草稿，10:发布
   */
  currState: number;
  /**
   * id
   */
  id: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标签Ids
   */
  tagSet: number[];
  /**
   * 标题
   */
  title: string;
  /**
   * 上游作品
   */
  upstreamPieceList: UpstreamPieceReq[];
}
export interface UpstreamPieceReq {
  /**
   * 比例
   */
  ratio: number;
  /**
   * 上游作品id
   */
  upstreamPieceId: number;
}

/** 新建文章 */
export function addOrEditReq(params: {
  params: AddOrEditData;
  cascadeId: string;
}) {
  return fetch.post<ApiResData<AddOrEditData>>(
    '/client/cascade/user/piece/edit',
    params.params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: params.cascadeId }),
      },
    }
  );
}

export interface InspiredVOListData {
  /**
   * 作者姓名
   */
  authorUsername?: string;
  /**
   * 创建人id
   */
  createBy?: number;
  /**
   * id
   */
  id?: number;
  /**
   * 标题
   */
  title?: string;
}

/** 启发 */
export function inspiredVOListReq(
  keyword: string,
  cascadeId: string,
  pieceUuid: string,
  existIds?: string
) {
  return fetch.get<ApiResData<InspiredVOListData[]>>(
    '/client/cascade/user/piece/searchUpstream',
    {
      params: {
        keyword,
        pieceUuid: pieceUuid === 'new-post' ? '' : pieceUuid,
        existIds,
      },
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

export interface CreatePieceReqParams {
  /**
   * 内容
   */
  content: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 状态：0，草稿，10:发布
   */
  currState: number;
  /**
   * id
   */
  id?: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * 标签Ids
   */
  tagSet: number[];
  /**
   * 标题
   */
  title: string;
  /**
   * 上游作品
   */
  upstreamPieceList?: UpstreamPieceReq[];
}

/** 发布文章 */
export function publishPieceReq(
  params: CreatePieceReqParams,
  cascadeId: string
) {
  return fetch.post<ApiResData<string>>(
    '/client/cascade/user/piece/publish',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 存为草稿文章 */
export function saveDraftReq(params: CreatePieceReqParams, cascadeId: string) {
  return fetch.post<ApiResData<string>>(
    '/client/cascade/user/piece/saveDraft',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

interface AddOrUpdateLinkParams {
  /**
   * 图片url
   */
  iconUrl: string;
  /**
   * id
   */
  id?: number;
  /**
   * 链接
   */
  link: string;
  /**
   * 名称
   */
  name: string;
}

/** 新增编辑链接 */
export function addOrUpdateLinkReq(
  params: AddOrUpdateLinkParams,
  spaceId: string
) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/manage/externalLink/edit',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}
/** 新增编辑链接 */
export function addOrUpdateUserLinkReq(
  params: AddOrUpdateLinkParams,
  userId: string
) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/home/manage/externalLink/edit',
    params,
    {
      headers: {
        userSpace: JSON.stringify({ namespace: userId }),
      },
    }
  );
}
/** 删除链接 */
export function deleteLinkReq(id: number, spaceId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/manage/externalLink/del',
    { id },
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 删除链接 */
export function deleteUserLinkReq(id: number, userId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/home/manage/externalLink/del',
    { id },
    {
      headers: {
        userSpace: JSON.stringify({ namespace: userId }),
      },
    }
  );
}

/** 添加 feature */
export function addPieceIdReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/feature/addPieceId',
    { id },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 移除 feature */
export function removePieceIdReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/feature/removePieceId',
    { id },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 审阅作品 */
export function reviewPieceReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/piece/reviewPiece',
    { id },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 作品详情 */
export function pieceDetailReq(pieceUuid: string, cascadeId: string) {
  return fetch.get<ApiResData<PieceDetailData>>(
    '/client/cascade/home/pieceInfo',
    {
      params: {
        pieceUuid,
      },
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 作品下架 */
export function pieceTakeDownReq(pieceId: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/piece/takeDown',
    {
      id: pieceId,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 作品上架 */
export function pieceTakeOnReq(pieceId: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/piece/takeOn',
    {
      id: pieceId,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 作品上链或者更新链 */
export function updateArIdReq(pieceId: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/user/piece/updateArId',
    {
      id: pieceId,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 空间上链或者更新链 */
export function updateCascadeArIdReq(cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/updateArId',
    null,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 作品 草稿删除 */
export function delDraftReq(pieceId: number, cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/user/piece/delDraft',
    {
      id: pieceId,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 打赏 */
export function rewardReq(
  params: {
    amount: number;
    pieceId: number;
  },
  cascadeId: string
) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/user/piece/reward',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 删除空间 */
export function delCascadeReq(cascadeId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/cascade/su/delCascade',
    null,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

export interface RewardDataForEverPay {
  /**
   * 分润比例
   */
  ratio: number;
  /**
   * 接收人钱包地址
   */
  receiver: string;
  /**
   * 交易的备注信息
   */
  txData: string;
}

/** everpay打赏 */
export function rewardByEverPayReq(cascadeId: string, pieceId?: number) {
  return fetch.post<ApiResData<RewardDataForEverPay[]>>(
    '/client/cascade/user/piece/dataForRewardByEverPay',
    {
      pieceId,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 评论 */
export function addOrEditCommentReq(
  params: {
    pieceId: number;
    content: string;
    id?: number;
    targetCommentId?: number;
  },
  cascadeId: string
) {
  return fetch.post<ApiResData<CommentList>>(
    '/client/cascade/user/piece/comment/edit',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 删除评论 */
export function delCommentReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<number>>(
    '/client/cascade/user/piece/comment/delete',
    { id },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 评论点赞 */
export function commentClickLikeReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<number>>(
    '/client/cascade/user/piece/comment/clickLike',
    { id },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}
/** 分享 计数 */
export function shareClickReq(id: number, cascadeId: string) {
  return fetch.post<ApiResData<number>>(
    '/client/cascade/home/clickShare',
    { id },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}
