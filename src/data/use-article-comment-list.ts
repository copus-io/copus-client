import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface CommetListParams {
  rows: number;
  pieceUuid?: string;
  endId?: number;
  commentId?: number;
}
export interface CommentList {
  articleId: number;
  badgeAuthor: boolean;
  badgeTree: boolean;
  canEdit: number;
  commentCount: number;
  content: string;
  createTime: number;
  id: number;
  isLike: number;
  likeCount: number;
  targetUserId: number;
  targetUsername: string;
  userFaceUrl: string;
  username: string;
  userId: number;
  seeDaoName: string;
  /** 二级评论 */
  children: CommentList[];
  /** true : 数据还没加载完 false ：数据已加载完 */
  isMore: boolean;
}
export interface CommetListData {
  begin: number;
  data: CommentList[];
  end: number;
  lastId: number;
  length: number;
  pageCount: number;
  pageNo: number;
  totalRecords: number;
}

/** comment */
export default function useCommetListReq(
  params: CommetListParams,
  cascadeId: string
) {
  return useSWR(
    params.rows && params.pieceUuid && cascadeId
      ? ['/client/cascade/home/comment/page', params, cascadeId]
      : null,
    ([url, params, cascadeId]) =>
      fetch
        .get<ApiResData<CommetListData>>(url, {
          params,
          headers: {
            cascadeInfo: JSON.stringify({ cascadeId }),
          },
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
