import { SpaceDetailInfo } from 'src/data/use-space-detail';
import SpaceInfo from '../SpaceInfo';
interface Props {
  spaceDetail: SpaceDetailInfo;
  handelOpen: () => void;
  mutateData: () => void;
}
const Menu = (props: Props) => {
  const { spaceDetail, handelOpen, mutateData } = props;
  return (
    <>
      <div
        className="Menu"
        style={{
          scrollbarWidth: 'none',
        }}
      >
        <SpaceInfo
          spaceDetail={spaceDetail}
          mutateData={mutateData}
          handelOpen={handelOpen}
        />
      </div>
    </>
  );
};

export default Menu;
