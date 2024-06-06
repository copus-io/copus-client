import type { CreationForHome } from 'src/data/use-creation-list';
import SpaceItem from './SpaceItem';
import TextItem from './TextItem';

interface CreationForHomeItemProps {
  item: CreationForHome;
  isBranchView?: boolean;
  onClick: () => void;
}

const Card = (props: CreationForHomeItemProps) => {
  const { item, onClick, isBranchView } = props;

  const getComponent = () => {
    switch (item.opusType) {
      case 10:
      case 20:
      case 30:
      case 40:
        return (
          <TextItem
            onClickItem={onClick}
            item={item}
            isBranchView={isBranchView}
          />
        );
      default:
        return <SpaceItem item={item} onClickItem={onClick} />;
    }
  };
  return <div className="px-[20px] pt-[25px]">{getComponent()}</div>;
};
export default Card;
