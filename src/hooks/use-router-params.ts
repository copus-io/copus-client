import { useRouter } from 'next/router';

/** 动态参数 */
const useRouterParams = () => {
  const router = useRouter();
  const spaceId = router.query.spaceId as string;
  const workUuid = router.query.workUuid as string;
  const userId = router.query.userId as string;
  const isReady = Object.keys(router.query).length > 0;
  // if (workUuid) {
  //   return {
  //     spaceId,
  //     workUuid,
  //     isReady,
  //   };
  // }
  return {
    spaceId,
    workUuid,
    isReady,
    userId,
  };
};
export default useRouterParams;
