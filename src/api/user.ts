import { KeywordPageReq } from 'src/data/use-user-creator-center-spaces-list';
import UserSimpleInfo from 'src/data/user-simpleInfo-model';
import { fetch } from 'src/fetch/intercept';

/** 登录 */
export function loginReq(params: { username: string; password: string }) {
  return fetch.post<ApiResData<string>>('/client/common/login', params);
}
/** 退出登录 */
export function logoutReq() {
  return fetch.post<ApiResData<string>>('/client/user/logout');
}
/** 获取验证码 */
export function getVerificationCodeReq(params: {
  codeType: number;
  email: string;
}) {
  return fetch.get<ApiResData<string>>('/client/common/getVerificationCode', {
    params,
  });
}

/** 注册 */
export function registerReq(params: {
  code: string;
  email: string;
  password: string;
  username: string;
  walletAddress: string;
}) {
  return fetch.post<ApiResData<string>>('/client/common/register', params);
}
/** 检测邮箱是否已注册 */
export function checkEmailExistReq(params: { email: string }) {
  return fetch.get<ApiResData<boolean>>('/client/common/checkEmailExist', {
    params,
  });
}

/** 检测用户名是否已经使用 */
export function checkUsernameExistReq(params: { username: string }) {
  return fetch.get<ApiResData<boolean>>('/client/common/checkUsernameExist', {
    params,
  });
}

/** 找回密码 */
export function findBackPswReq(params: {
  code: string;
  email: string;
  password: string;
}) {
  return fetch.post<ApiResData<string>>('client/common/findbackPsw', params);
}

/** 修改密码 */
export function changeUserPassword(params: { oldPsw: string; newPsw: string }) {
  return fetch.post<ApiResData<string>>('/client/user/changePsw', params);
}

/** Profile details */
export interface UserInformationRes {
  id: number;
  username: string;
  walletAddress: string;
  faceUrl: string;
  badgeAuthor: boolean;
  badgeTree: boolean;
  followerCount: number;
  followingCount: number;
}
export function userInformationReq(userId: string) {
  return fetch
    .get<ApiResData<UserInformationRes>>('/client/user/index/userInfo', {
      params: {
        userId,
      },
    })
    .then((res) => {
      return res.data.data;
    });
}

/** User's articles */
export interface UserPiece {
  arId: string;
  lastEditBy: number;
  currState: number;
  language: number;
  likeCount: number;
  title: string;
  readCount: number;
  tags: string;
  coverUrl: string;
  createBy: number;
  subTitle: string;
  createTime: number;
  createUser: string;
  id: number;
}
export interface UserPieceRes {
  data: UserPiece[];
  begin: number;
  end: number;
  length: number;
  totalRecords: number;
  pageNo: number;
  pageCount: number;
}
export function userArticlesReq(userId: string, page: number) {
  return fetch
    .get<ApiResData<UserPieceRes>>('/client/user/index/articlePage', {
      params: {
        userId,
        page,
      },
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      return null;
    });
}

/** 消息已读 */
export function readMessageReq(params: { id: number }) {
  return fetch.post<ApiResData<string>>('/client/user/msg/read', params);
}

/** 删除消息 */
export function deleteMessageReq(params: { id: number }) {
  return fetch.post<ApiResData<string>>('/client/user/msg/delete', params);
}

/**
 * UserInfo
 */
export interface UserInfo {
  /**
   * 个人描述
   */
  bio: string;
  /**
   * 日上链id
   */
  dailyStreamArId: string;
  /**
   * 邮箱 唯一
   */
  email: string;
  /**
   * 头像
   */
  faceUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 流入量
   */
  inStream: number;
  /**
   * 语言类型 0:英语 10:中文
   */
  languageType?: number;
  /**
   * 主页子空间名
   */
  namespace?: string;
  /**
   * 作品数量
   */
  opusCount?: number;
  /**
   * 流出量
   */
  outStream: number;
  /**
   * seeDao的sns
   */
  seeDaoName: string;
  seedaoAlias: boolean;
  /**
   * 系统生成的临时钱包地址
   */
  tempWalletAddress: string;
  /**
   * token的数量
   */
  tokenAmount: number;
  /**
   * 用户名 唯一
   */
  username: string;
  /**
   * 钱包地址 唯一
   */
  walletAddress: string;
  [property: string]: any;
}

export function getUserInfoReq() {
  return fetch.get<ApiResData<UserInfo>>('/client/user/userInfo');
}
/** 绑定seedao name */
export function updateExtendInfo(params: { type: number; value: string }) {
  return fetch.post<ApiResData<string>>(
    '/client/user/updateExtendInfo',
    params
  );
}

/**
 * 通过钱包地址，获取雪花随机数
 */
export function getSnowflake(params: { address: any }) {
  return fetch.get<ApiResData<string>>('/client/common/getSnowflake', {
    params,
  });
}

/**
 * metamask登录
 */
export function loginWithMetamask(params: { address: any; signature: any }) {
  return fetch.post<ApiResData<string>>(
    '/client/common/metamask/login',
    params
  );
}

/**
 * everPay登录
 */
export function loginWithEverPay(params: {
  email: any;
  sig: any;
  everId: any;
}) {
  return fetch.post<ApiResData<string>>('/client/common/everId/login', params);
}
export function loginWithArConnect(params: {
  address: any;
  sig: any;
  publicKey: any;
}) {
  return fetch.post<ApiResData<string>>(
    '/client/common/arconnect/login',
    params
  );
}

/** 第三方登陆 */

export function authLogin(params: { type: any }) {
  return fetch.get<ApiResData<string>>(
    '/client/common/oauth/authLogin/' + params.type
  );
}

/** 第三方登陆 */
export function thirdLogin(params: { url: any }) {
  return fetch.get<ApiResData<string>>(
    '/client/common/oauth/google/login' + params.url
  );
}

export function getUserListByKeyword(params: { keyword: String }) {
  return fetch.get<ApiResData<string>>(
    '/client/common/user/getUserListByKeyword',
    {
      params,
    }
  );
}

export interface UserForInviteToSpace extends UserSimpleInfo {
  isInvited: boolean;
}

export function userListForInviteToSpace(
  params: KeywordPageReq,
  namespace: string
) {
  return fetch.get<ApiResData<PagingResData<UserForInviteToSpace>>>(
    '/client/user/space/manage/userListForInviteToSpace',
    {
      params,
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

export function inviteMemberById(
  params: { userIds: Array<number> },
  namespace: string
) {
  return fetch.post<ApiResData<string>>(
    '/client/user/space/manage/inviteMemberByIds',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    }
  );
}

/** 修改用户权限 */
export function changeUserRoleReq(id: number, spaceId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/manage/member/changeUserRole',
    { id },
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 移除用户权限 */
export function banUserReq(id: number, spaceId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/manage/member/ban',
    { id },
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 私密空间 移出被邀请的会员 */
export function removeInvited(id: number, spaceId: string) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/manage/removeInvited',
    { id },
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}

/** 审核加入专属空间的请求 */
export function checkApplyJoinSpace(
  params: { id: number; currState: number },
  spaceId: string
) {
  return fetch.post<ApiResData<boolean>>(
    '/client/user/space/manage/checkApplyJoinSpace',
    params,
    {
      headers: {
        spaceInfo: JSON.stringify({ namespace: spaceId }),
      },
    }
  );
}
