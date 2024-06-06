import { useMemo, useState } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { OpusTagInfo } from './use-work-detail';
import UserSimpleInfo from './user-simpleInfo-model';

export interface OpusCardInfo {
  /**
   * ar的存储id
   */
  arId?: string;
  /**
   * 封面图
   */
  coverUrl: string;
  /**
   * 状态：0，草稿，10：发布
   */
  currState?: number;
  /**
   * id
   */
  id: number;
  /**
   * 作品类型
   */
  opusType?: number;
  /**
   * 分润比例
   */
  ratio: number;
  /**
   * 摘要
   */
  subTitle: string;
  /**
   * tag
   */
  tagInfos?: OpusTagInfo[];
  /**
   * 标题
   */
  title: string;
  userInfo: UserSimpleInfo;
  /**
   * uuid
   */
  uuid: string;
  createTime: number;
}

/** 上游列表 */
export function useOpusStreamListReq(uuid: string) {
  return useSWR(
    uuid ? [`/client/common/opus/upstreamList/${uuid}`] : null,
    ([url]) =>
      fetch.get<ApiResData<OpusCardInfo[]>>(url, {}).then((res) => {
        return res.data.data;
      })
  );
}

interface OpusDownstreamListParams {
  uuid?: string;
  pageIndex?: number;
  /**
   * 每页显示记录数
   */
  pageSize?: number;
}
/** 下游列表 */
export function useOpusDownstreamListReq(params: OpusDownstreamListParams) {
  const [total, setTotal] = useState(0);
  const data = useSWRInfinite(
    (index) => {
      return params.pageSize
        ? [
            `/client/common/opus/downstreamList/${params.uuid}`,
            index + 1,
            params,
          ]
        : null;
    },
    ([url, pageIndex, params]) =>
      fetch
        .get<ApiResData<PagingResData<OpusCardInfo>>>(url, {
          params: {
            pageSize: params.pageSize,
            pageIndex,
          },
        })
        .then((res) => {
          setTotal(res.data.data?.totalRecords || 0);
          return res.data.data?.data || [];
        }),
    {
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  );

  const result = useMemo(() => {
    return {
      ...data,
      total,
    };
  }, [data, total]);
  return result;
}
