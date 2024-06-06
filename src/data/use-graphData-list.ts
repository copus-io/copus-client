import { useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';

/**
 * StarInfo
 */
export interface StarInfo {
  /**
   * clusters，文章的类型
   */
  clusters?: { [key: string]: string }[];
  /**
   * edges
   */
  edges?: Array<string[]>;
  /**
   * nodes
   */
  nodes?: StarNode[];
  /**
   * tags，策展空间会用到
   */
  tags?: OpusTagForGraph[];
  [property: string]: any;
}

/**
 * StarNode
 */
export interface StarNode {
  /**
   * 作品类型：10：文字，20：图片，30：音频，40：视频
   */
  cluster?: string;
  /**
   * id
   */
  key?: string;
  /**
   * 标题
   */
  label?: string;
  /**
   * 下游作品的数量
   */
  score?: number;
  /**
   * tag属性，策展空间会用到
   */
  tag?: string;
  /**
   * url
   */
  url?: string;
  /**
   * uuid
   */
  uuid?: string;
  [property: string]: any;
}

/**
 * OpusTagForGraph
 */
export interface OpusTagForGraph {
  /**
   * id
   */
  key?: string;
  /**
   * tag名称
   */
  tag?: string;
  [property: string]: any;
}
/** 首页图谱数据 */
export default function useGraphDataListReq() {
  const data = useSWRInfinite(
    (index) => {
      return ['/client/home/graphData'];
    },
    ([url]) =>
      fetch.get<ApiResData<StarInfo>>(url).then((res) => {
        return res.data?.data || [];
      }),
    {
      revalidateFirstPage: false,
      revalidateOnMount: true,
    }
  );

  const result = useMemo(() => {
    return {
      ...data,
    };
  }, [data]);
  return result;
}
