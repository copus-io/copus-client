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
/**
 * 空间图谱数据
 */

export default function useHomeGraphDataList(
  namespace?: string,
  fromPage: number = 0,
  uuid?: any
) {
  let reqUrl = ['/client/home/graphData'];
  let headerInfo = {};
  if (fromPage === 1) {
    reqUrl = ['/client/common/space/graphData', namespace!];
    headerInfo = {
      headers: {
        spaceInfo: JSON.stringify({ namespace }),
      },
    };
  }
  if (fromPage === 2) {
    reqUrl = ['/client/common/user/home/graphData', namespace!];
    headerInfo = {
      headers: {
        userSpace: JSON.stringify({ namespace: namespace }),
      },
    };
  }
  if (fromPage === 3) {
    reqUrl = ['/client/common/opus/graphData', uuid, namespace!];
    headerInfo = {
      params: {
        uuid,
      },
      // headers: {
      //   userSpace: JSON.stringify({ namespace: namespace }),
      // },
    };
  }

  const data = useSWRInfinite(
    (index) => {
      return reqUrl;
    },
    ([url]) =>
      fetch.get<ApiResData<StarInfo>>(url, headerInfo).then((res) => {
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
export function useUserHomeGraphDataList(namespace?: string) {
  const data = useSWRInfinite(
    (index) => {
      return namespace
        ? ['/client/common/space/graphData', namespace]
        : ['/client/home/graphData'];
    },
    ([url]) =>
      fetch
        .get<ApiResData<StarInfo>>(
          url,
          namespace
            ? {
                headers: {
                  spaceInfo: JSON.stringify({ namespace }),
                },
              }
            : {}
        )
        .then((res) => {
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
