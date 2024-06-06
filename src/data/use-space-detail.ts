import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
import UserSimpleInfo from './user-simpleInfo-model';
/**
 * SpaceDetailInfo
 */
export interface SpaceDetailInfo {
  /**
   * 操作等级：0：公开（空间：开放，作品：公开）：10：专属空间，20：私密空间（作品：私享）
   */
  accessLevel?: number;
  /**
   * ar的存储id
   */
  arId?: string;
  /**
   * 封面图
   */
  coverUrl?: string | any;
  /**
   * 创建人id
   */
  createBy?: number;
  /**
   * 创建时间 yyyy-MM-dd HH:mm
   */
  createTime?: Date;
  /**
   * 状态：0，草稿，10：发布，20：下架
   */
  currState?: number;
  decorate: DecorateTemplateResp;
  /**
   * 下游作品的数量
   */
  downstreamCount?: number;
  /**
   * 最后编辑人
   */
  editBy?: number;
  /**
   * 最后编辑时间 yyyy-MM-dd HH:mm
   */
  editTime?: Date;
  /**
   * id
   */
  id?: number;
  /**
   * 是否已被删除
   */
  isDeleted?: boolean;
  /**
   * 是否是空间
   */
  isSpace?: boolean;
  /**
   * 语言类型
   */
  languageType?: number;
  /**
   * 作品类型：10：文字，20：图片，30：音频，40：视频，50：混，
   */
  opusType?: number;
  /**
   * 被打赏的数量（空间税收的收入，单个作品打赏的收入）
   */
  rewardAmount?: number;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  space?: Space;
  /**
   * 描述
   */
  subTitle?: string;
  /**
   * 标题
   */
  title?: string;
  userInfo?: UserSimpleInfo;
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

/**
 * DecorateTemplateResp
 */
export interface DecorateTemplateResp {
  /**
   * 背景图url
   */
  bgImageUrl?: string;
  /**
   * 主题色
   */
  color?: string;
  /**
   * 透明度 0 - 100
   */
  opacity?: number;
  /**
   * 主题模式
   */
  theme?: string;
  [property: string]: any;
}

/**
 * Space
 */
export interface Space {
  /**
   * id 映射到creationId
   */
  id?: number;
  /**
   * 是否启动
   */
  isEnable?: boolean;
  /**
   * logo的url
   */
  logoUrl?: string;
  /**
   * 空间域名
   */
  namespace?: string;
  /**
   * 作品加入是否需要审核
   */
  opusCheckIn?: boolean;
  /**
   * 空间税率
   */
  taxRatio?: number;
  /**
   * 金库总流量
   */
  totalStream?: number;
  /**
   * 金库钱包地址
   */
  treasuryAddress?: string;
  /**
   * 用户数量
   */
  userCount?: number;

  [property: string]: any;
}

/** 空间详情 */
export default function useSpaceDetailReq(spaceId: string) {
  const res = useSWR(
    spaceId ? ['/client/common/space/spaceInfo', spaceId] : null,
    ([url, spaceId]) =>
      fetch
        .get<ApiResData<SpaceDetailInfo>>(url, {
          headers: {
            spaceInfo: JSON.stringify({ namespace: spaceId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
  return res;
}
