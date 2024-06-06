import { useRouter } from 'next/router';
import { userFace } from 'src/components/common';
import { CreationForHome } from 'src/data/use-creation-list';
import { formatTimestamp } from 'src/utils/common';
interface CreationForHomeItemProps {
  item: CreationForHome;
  isTitle?: boolean;
}

const AuthorView = (props: CreationForHomeItemProps) => {
  const { item } = props;
  const router = useRouter();

  return (
    <div className="flex relative w-full leading-[18px] !text-[#5e5e5e] text-[14px] h-[18px]">
      By
      <div className="mx-[3px] flex items-center">
        {userFace(
          item.userInfo?.faceUrl,
          'w-[18px] h-[18px]',
          'w-[14px] h-[16px]'
        )}
      </div>
      <span
        className="ml-1 cursor-pointer underline "
        onClick={(e) => {
          router.push(`/user/${item.userInfo.namespace}`);
          e.stopPropagation();
        }}
      >
        {item.userInfo?.username}
      </span>
      <span className="mx-[10px]">•</span>
      {item?.createTime && <div>{formatTimestamp(item.createTime as any)}</div>}
    </div>
  );
};
export default AuthorView;
