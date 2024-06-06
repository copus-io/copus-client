import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
/**
 * SpaceMetaInfo
 */
export interface SpaceMetaInfo {
  /**
   * 操作等级：0：公开（空间：开放，作品：公开）：10：专属空间，20：私密空间（作品：私享）
   */
  accessLevel?: number;
  /**
   * 下游作品的数量
   */
  downstreamCount?: number;
  /**
   * id
   */
  id?: number;
  /**
   * logo的url
   */
  logoUrl?: string;
  /**
   * 空间域名
   */
  namespace?: string;
  /**
   * 被打赏的数量（空间税收的收入，单个作品打赏的收入）
   */
  rewardAmount?: number;
  /**
   * 角色：-1：关注者，0：创建人，10：空间管理员，20：关注空间的人
   */
  role?: number;
  /**
   * 标题
   */
  title?: string;
  /**
   * 用户数量
   */
  userCount?: number;
}

/** 作品投递的空间列表 */
export function useOpusInSpacesReq(uuid: string) {
  return useSWR(
    uuid ? ['/client/common/opus/inSpaces', uuid] : null,
    ([url, uuid]) =>
      fetch
        .get<ApiResData<SpaceMetaInfo[]>>(url, {
          params: {
            uuid: uuid,
          },
          // headers: {
          //   spaceInfo: JSON.stringify({ namespace: uuid }),
          // },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
