import { CreationForSpaceHome } from 'src/data/use-creation-list';
import { KeywordPageReq } from 'src/data/use-user-creator-center-spaces-list';
import { OpusCommentInfo } from 'src/data/use-work-comment-list';
import { fetch } from 'src/fetch/intercept';
import { MetaDataInfo } from './space';

/**
 * SubmitToSpaceReq
 */
export interface SubmitToSpaceReqParams {
  /**
   * 作品ids
   */
  opusIds?: number[];
  /**
   * 空间ids
   */
  spaceIds?: number[];

  message?: string;
}
/** 投递某些作品到某些空间  */
export function submitToSpaceReq(params: SubmitToSpaceReqParams) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/creator/center/opus/submitToSpace',
    params,
    {
      headers: {
        // cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}
export function submitWorksToOneSpaceReq(
  params: SubmitToSpaceReqParams,
  namespace: string
) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/submitToSpace',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}
/**
 * takeDownFromSpaceReq
 */
export interface TakeDownFromSpaceReqParams {
  /**
   * 作品id
   */
  opusId?: number;
  /**
   * 空间id
   */
  spaceId?: number;
}
/** 作品主动和某个空间断开   */
export function takeDownFromSpaceReq(params: TakeDownFromSpaceReqParams) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/creator/center/opus/takeDownFromSpace',
    params
  );
}

/** 撤回投递    */
export function takeBackReq(id: number) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/creator/center/opus/submission/takeBack',
    { id },
    {
      headers: {
        // cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 置顶  */
// export function featureReq(id: number) {
//   return fetch.post<ApiResData<boolean>>(
//     '/client/user/space/opus/manage/feature',
//     { id },
//     {
//       headers: {
//         // cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
//       },
//     }
//   );
// }
/** 作品主动和某个空间断开   */
export function cutBranchReq(uuid: string, downStreamId: number) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/opus/creator/cutBranch',
    { uuid, downStreamId },
    {
      headers: {
        // cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}
/** 对下游作品的置顶操作   */
export function featureReq(uuid: string, downStreamId: number) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/opus/creator/feature',
    { uuid, downStreamId },
    {
      headers: {
        // cascadeInfo: JSON.stringify({ cascadeId: cascadeId }),
      },
    }
  );
}

/** 评论 */
export function addOrEditCommentReq(params: {
  opusId: number;
  content: string;
  id?: number;
  targetCommentId?: number;
}) {
  return fetch.post<ApiResData<OpusCommentInfo>>(
    '/client/user/opus/comment/edit',
    params
  );
}

/** 删除评论 */
export function delCommentReq(id: number) {
  return fetch.post<ApiResData<number>>('/client/user/opus/comment/delete', {
    id,
  });
}

/** 评论点赞 */
export function commentClickLikeReq(id: number) {
  return fetch.post<ApiResData<number>>('/client/user/opus/comment/clickLike', {
    id,
  });
}

/** 打赏 */
export function rewardReq(params: {
  amount: number;
  opusId: number;
  spaceId?: number;
}) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/opus/reader/streamIt',
    params
  );
}
export function deleteDraft(params: { id: number }) {
  return fetch.post<ApiResData<boolean>>(
    'client/user/creator/center/opus/draft/delete',
    params
  );
}
export function workCancelSubmit(params: { id: number }) {
  return fetch.post<ApiResData<boolean>>(
    'client/user/creator/center/opus/submission/takeBack',
    params
  );
}

/**
 * 用户可以在当前空间投递的作品列表
 */
export async function workListCanSubmitToSpaceReq(
  params: KeywordPageReq,
  namespace: string
) {
  const resp = await fetch.get<ApiResData<PagingResData<CreationForSpaceHome>>>(
    '/client/user/space/pageOpusForSubmitSpace',
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

export function workChangeAccessLevel(params: { id: number }) {
  return fetch.post<ApiResData<boolean>>(
    'client/user/creator/center/opus/changeAccessLevel',
    params
  );
}

export function workDeleteReader(params: { id: number }) {
  return fetch.post<ApiResData<boolean>>(
    'client/user/creator/center/opus/deleteReader',
    params
  );
}

interface InviteReaderReq {
  opusId: number;
  emails?: string[];
  readers?: number[];
}

export function workInviteReaders(params: InviteReaderReq) {
  return fetch.post<ApiResData<boolean>>(
    'client/user/creator/center/opus/inviteReaders',
    params
  );
}

export function opusMetaInfoReq(uuid: string) {
  return fetch.get<ApiResData<MetaDataInfo>>(
    '/client/common/opus/metaInfo/' + uuid
  );
}

interface OpusTagSetting {
  opusId?: number;
  tagId: number;
}

export function opusSetTag(params: OpusTagSetting, namespace: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/opus/tag/setTag',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: namespace }),
      },
    }
  );
}
