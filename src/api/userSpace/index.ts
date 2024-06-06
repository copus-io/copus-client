import { fetch } from 'src/fetch/intercept';
import { MetaDataInfo } from '../space';

/**
 * Request
 *
 * ResultTO«boolean»，接口返回对象
 */
export interface Request {
  /**
   * 数据体
   */
  data: boolean;
  /**
   * 消息
   */
  msg: string;
  /**
   * 成功标志 0：失败，1：成功
   */
  status: number;
  [property: string]: any;
}

/** 关注 */
export function onClickFollowReq(userId: string) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/home/reader/onClickFollow',
    {},
    {
      headers: {
        userSpace: JSON.stringify({ namespace: userId }),
      },
    }
  );
}

export function onClickUnFollowReq(userId: number) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/home/reader/onClickUnFollow',
    { id: userId }
  );
}

/** 加入空间 */
export function onJoinSpaceReq(namespace: string) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/space/onClickJoinSpace',
    {},
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}
export function confirmInviteSpace(params: { id: number; currState: number }) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/creator/center/space/onConfirmInvite',
    params
  );
}

export function readTheSubmissionToSpace(
  params: { id: number },
  namespace: string
) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/space/opus/manage/readTheSubmission',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

export function handleSubmissionToSpace(
  params: { id: number; currState: number },
  namespace: string
) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/space/opus/manage/handleSubmit',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

export function featureOpusForSpace(params: { id: number }, namespace: string) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/space/opus/manage/feature',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

export function takenDownFromSpace(params: { id: number }, namespace: string) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/space/opus/manage/takeDown',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

export function UnFollowUser(params: { id: number }, namespace: string) {
  return fetch.post<ApiResData<Request>>(
    '/client/user/space/opus/manage/takeDown',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

export function userSpaceMetaInfoReq(namespace: string) {
  return fetch.get<ApiResData<MetaDataInfo>>(
    '/client/common/user/home/metaInfo',
    {
      headers: {
        userSpace: JSON.stringify({ namespace: namespace }),
      },
    }
  );
}
