import useSWR from 'swr';
import { fetch } from '../fetch/intercept';

export interface SpaceExternalLinkInfo {
  /**
   * 图片url
   */
  iconUrl: string;
  /**
   * id
   */
  id: number;
  /**
   * 链接
   */
  link: string;
  /**
   * 名称
   */
  name: string;
}

/** 空间额外链接 */
export default function useExternalLinksReq(namespace: string) {
  return useSWR(
    namespace ? ['/client/common/space/externalLinks', namespace] : null,
    ([url, namespace]) =>
      fetch
        .get<ApiResData<SpaceExternalLinkInfo[]>>(url, {
          headers: {
            spaceInfo: JSON.stringify({ namespace }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
