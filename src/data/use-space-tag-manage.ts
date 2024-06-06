import useSWR from 'swr';
import { fetch } from '../fetch/intercept';
import { OpusTagInfo } from './use-work-detail';

/** 空间 tag 管理 */
export default function useSpaceTagManageReq(spaceId: string) {
  return useSWR(
    spaceId ? ['/client/user/space/tag/list', spaceId] : null,
    ([url, spaceId]) =>
      fetch
        .get<ApiResData<OpusTagInfo[]>>(url, {
          headers: {
            spaceInfo: JSON.stringify({ namespace: spaceId }),
          },
        })
        .then((res) => {
          return res.data.data;
        })
  );
}
