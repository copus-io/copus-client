import { UserSpaceInfo } from 'src/data/use-userHome-detail';
import UserInfo from '../UserInfo';
interface Props {
  userInfoDetail: UserSpaceInfo;
  handelClose: (type: number) => void;
  mutateData: () => void;
}
const Menu = (props: Props) => {
  const { userInfoDetail, handelClose, mutateData } = props;
  return (
    <>
      <div className="Menu m-[20px]">
        <UserInfo
          userInfo={userInfoDetail}
          mutateData={mutateData}
          handelClose={handelClose}
        />
      </div>
    </>
  );
};

export default Menu;
