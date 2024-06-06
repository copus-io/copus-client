import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * Page«OpusCommentInfo»
 */
export interface PageOpusCommentInfo {
  data: OpusCommentInfo[];
  /**
   * 最后一条数据的id
   */
  lastId?: number;
  /**
   * 总共页数
   */
  pageCount: number;
  /**
   * 当前页码
   */
  pageIndex: number;
  /**
   * 每页显示记录数
   */
  pageSize: number;
  /**
   * 查询结果总记录数
   */
  totalRecords: number;
  [property: string]: any;
}

/**
 * OpusCommentInfo
 */
export interface OpusCommentInfo {
  /**
   * 能否编辑
   */
  canEdit: boolean;
  /**
   * 子评论数量
   */
  commentCount: number;
  /**
   * 内容
   */
  content: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * id
   */
  id: number;
  /**
   * 能否点赞过
   */
  isLike: boolean;
  /**
   * 点赞数量
   */
  likeCount: number;
  /**
   * 作品id
   */
  opusId: number;
  /**
   * 二级评论针对的目标用户id
   */
  targetUserId: number;
  /**
   * @某人姓名
   */
  targetUsername: string;
  userInfo: UserSimpleInfo;
  [property: string]: any;
}
export interface CommetListParams {
  /**
   * 评论id
   */
  commentId?: number;
  /**
   * 最后一条数据的id
   */
  endId?: number;
  /**
   * 作品Uuid
   */
  opusUuid: string;
  /**
   * 每页数量
   */
  rows?: number;
  [property: string]: any;
}
/** comment */
export default function useCommetListReq(params: CommetListParams) {
  return useSWR(
    params.rows && params.opusUuid
      ? ['/client/common/opus/comment/page', params]
      : null,
    ([url, params]) =>
      fetch
        .get<ApiResData<PageOpusCommentInfo>>(url, {
          params,
        })
        .then((res) => {
          return {
            ...res.data.data,
            data: res.data.data.data.map((item, index) => ({
              ...item,
              children: [],
              isMore: res.data.data.lastId !== 0,
            })),
          };
        })
  );
}
