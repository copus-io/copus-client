import useSWRInfinite from 'swr/infinite';
import { fetch } from '../fetch/intercept';
import { useMemo } from 'react';
import UserSimpleInfo from './user-simpleInfo-model';

/**
 * SpaceSimpleInfo
 */
export interface SpaceSimpleInfo {
  /**
   * arId
   */
  arId: string;
  /**
   * 创建者id
   */
  createBy: number;
  /**
   * 数据库id
   */
  id: number;
  /**
   * logo的url
   */
  logoUrl: string;
  /**
   * 唯一标识，用于二级域名
   */
  namespace: string;
  /**
   * 在空间中的角色：-1：未关注空间的用户，0：空间创建者，10： 管理员，20:关注空间的用户
   */
  role: number;
  /**
   * 名称
   */
  title: string;
  userInfo?: UserSimpleInfo;
  [property: string]: any;
}

/** 用户拥有空间列表 */
export default function useAuthorCascadeListReq() {
  const data = useSWRInfinite(
    (index) => {
      return ['/client/user/space/mySpaces'];
    },
    ([url]) =>
      fetch.get<ApiResData<SpaceSimpleInfo>>(url).then((res) => {
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
