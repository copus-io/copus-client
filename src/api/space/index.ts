import type { SpaceDetailInfo } from 'src/data/use-space-detail';
import { fetch } from 'src/fetch/intercept';

export interface CascadeInfo {
  /**
   * 文章分成保留比例
   */
  taxRatio: number;
  /**
   * 唯一标识，用于二级域名
   */
  cascadeId: string;
  /**
   * 首图url
   */
  coverUrl: string;
  /**
   * 创建者id
   */
  creatorId: number;
  /**
   * 描述
   */
  description: string;
  /**
   * 数据库id
   */
  id: number;
  /**
   * logo的url
   */
  logoUrl: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}

/** 创建空间 */
export function createCascadReq(params: {
  /**
   * 操作等级
   */
  accessLevel?: number;
  /**
   * 首图url
   */
  coverUrl?: string;
  /**
   * 描述
   */
  description?: string;

  /**
   * logo的url
   */
  logoUrl?: string;
  /**
   * 名称
   */
  title: string;
  /**
   * 空间税率
   */
  taxRatio: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress: string;
}) {
  return fetch.post<ApiResData<SpaceDetailInfo>>(
    '/client/user/space/creator/newSpace',
    params
  );
}

/** 新建about */
export function createCascadAboutReq(content: string, cascadeId: string) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/cascade/su/about/edit',
    {
      content,
    },
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/** 新建tag */
export function createSpaceTagReq(
  params: {
    tag: string;
    tagColor: string;
    id?: number;
  },
  spaceId: string
) {
  return fetch.post<ApiResData<TagInfo>>(
    '/client/user/space/tag/edit',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 更改空间名称 */
export function updateSpaceNamespace(
  params: {
    name: string;
  },
  spaceId: string
) {
  return fetch.post<ApiResData<Boolean>>(
    '/client/user/space/manage/updateNamespace',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 删除tag */
export function delSpaceTagReq(id: number, spaceId: string) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/user/space/tag/changeDeletedState',
    {
      id,
    },
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 更改序号 */
interface SortTagParams {
  /** 序号 */
  sortOrder: number;
  id: string | number;
}
export function sortSpaceTag(params: SortTagParams[], spaceId: string) {
  return fetch.post<ApiResData<TagInfo>>(
    '/client/user/space/tag/sort',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}
/**
 * UpdateSpaceParams
 *
 * CreateSpaceReq
 */
export interface UpdateSpaceParams {
  /**
   * 操作等级：0：公开（空间：开放）：10：专属空间，20：私密空间
   */
  accessLevel?: number;
  /**
   * 首图url
   */
  coverUrl?: string;
  /**
   * logo的url
   */
  logoUrl?: string;
  /**
   * 作品加入是否需要审核
   */
  opusCheckIn?: boolean;
  /**
   * 描述
   */
  subTitle?: string;
  /**
   * 空间税率
   */
  taxRatio?: number;
  /**
   * 名称
   */
  title?: string;
  /**
   * 金库钱包地址
   */
  treasuryAddress?: string;
  [property: string]: any;
}

/** 编辑空间 */
export function updateSpaceReq(params: UpdateSpaceParams, spaceId: string) {
  if (params.title) {
    params.title = params.title.trim();
  }

  if (params.logoUrl) {
    params.logoUrl = params.logoUrl.trim();
  }

  if (params.coverUrl) {
    params.coverUrl = params.coverUrl.trim();
  }

  if (params.subTitle) {
    params.subTitle = params.subTitle.trim();
  }

  if (params.treasuryAddress) {
    params.treasuryAddress = params.treasuryAddress.trim();
  }

  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/user/space/manage/updateSpaceInfo',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/**
 * UpdateUserParams
 */
export interface UpdateUserParams {
  /**
   * 个人描述
   */
  bio?: string;
  /**
   * 主页封面图
   */
  coverUrl?: string;
  /**
   * 用户头像
   */
  faceUrl?: string;
  /**
   * 主页子空间名
   */
  namespace?: string;
  /**
   * 密码,最多64位
   */
  newPsw?: string;
  /**
   * 用户名称
   */
  userName?: string;
  /**
   * 钱包地址
   */
  walletAddress?: string;
}

/** 编辑个人中心 */
export function updateUserReq(params: UpdateUserParams, userId: string) {
  if (params.userName) {
    params.userName = params.userName.trim();
  }
  if (params.bio) {
    params.bio = params.bio.trim();
  }
  if (params.faceUrl) {
    params.faceUrl = params.faceUrl.trim();
  }

  if (params.coverUrl) {
    params.coverUrl = params.coverUrl.trim();
  }
  if (params.namespace) {
    params.namespace = params.namespace.trim();
  }
  if (params.newPsw) {
    params.newPsw = params.newPsw.trim();
  }
  if (params.walletAddress) {
    params.walletAddress = params.walletAddress.trim();
  }

  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/user/updateUserInfo',
    params,
    {
      headers: {
        useInfo: JSON.stringify({ namespace: userId }),
      },
    }
  );
}

export interface HeadMetaData {
  detail: MetaDataInfo;
}

export interface MetaDataInfo {
  title: string;
  coverUrl: string;
  subTitle: string;
}

interface NeedTagParams {
  needTag: boolean;
}
/** 空间详情用于seo */
export function spaceMetaInfoReq(cascadeId: string) {
  return fetch.get<ApiResData<MetaDataInfo>>('/client/common/space/metaInfo', {
    headers: {
      spaceInfo: JSON.stringify({ namespace: cascadeId }),
    },
  });
}

/** 关注空间 */
export function followReq(id: number) {
  return fetch.post<ApiResData<boolean>>('/client/user/cascade/follow', {
    id,
  });
}

/** 取消关注空间 */
export function unFollowReq(id: number) {
  return fetch.post<ApiResData<boolean>>('/client/user/cascade/unfollow', {
    id,
  });
}

// 装修模版
interface CascaddeCorate {
  /**
   * 主题
   */
  theme: string;
  /**
   * 主题色
   */
  color: string;
  /**
   * bgImageUrl
   */
  bgImageUrl: string;
}

/** 编辑空间 */
export function publishDecorate(params: CascaddeCorate, cascadeId: string) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/cascade/su/decorate/publish',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/**
 * 获取地块
 */
interface CaslandInfo {
  description?: string;
  isShowHome?: boolean;
  id?: any;
  name?: string;
  periods: number;
  price: number;
  tileNum: string;
}
export function caslandInfoReq(cascadeId: string) {
  return fetch.get<ApiResData<CaslandInfo>>(
    '/client/cascade/su/casland/tileForSell',
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

export function buyCasland(
  params: {
    id: number | any;
  },
  cascadeId: string
) {
  return fetch.post<ApiResData<CaslandInfo>>(
    '/client/cascade/su/casland/buyTile',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

/**
 * 编辑
 */

export function editCasland(params: CaslandInfo, cascadeId: string) {
  return fetch.post<ApiResData<CaslandInfo>>(
    'client/cascade/su/casland/editTile',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}
interface NotificaationParams {
  id: number;
  value: number;
}
/** 更改消息推送 */
export function changeNotificaationReq(
  params: NotificaationParams,
  cascadeId: string
) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/user/msg/console/setValue',
    params,
    {
      headers: {
        cascadeInfo: JSON.stringify({ cascadeId }),
      },
    }
  );
}

export function changeLangReq(
  params: {
    languageType: number;
  },
  userId: string
) {
  return fetch.post<ApiResData<CascadeInfo>>(
    '/client/user/updateLanguage',
    params,
    {
      headers: {
        useInfo: JSON.stringify({ namespace: userId }),
      },
    }
  );
}
