import AudioItem from './AudioItem';
import ImageItem from './ImageItem';
import TextItem from './TextItem';
import VideoItem from './VideoItem';

export interface BranchersCardItemProps {
  item: any;
  onClick?: () => void;
  onMoreClickWithIndex: (index: number) => void;
}

const BranchersCard = (props: BranchersCardItemProps) => {
  const { item, onClick, onMoreClickWithIndex } = props;

  const getComponent = () => {
    switch (item.opusType) {
      case 10:
        return (
          <TextItem item={item} onMoreClickWithIndex={onMoreClickWithIndex} />
        );
      case 20:
        return (
          <ImageItem item={item} onMoreClickWithIndex={onMoreClickWithIndex} />
        );
      case 40:
        return (
          <VideoItem item={item} onMoreClickWithIndex={onMoreClickWithIndex} />
        );
      case 30:
        return (
          <AudioItem item={item} onMoreClickWithIndex={onMoreClickWithIndex} />
        );
    }
  };
  return (
    // <Link
    //   href={`/${item.uuid}`}
    //   // href={`/testtmp/test`}
    //   key={item.uuid}
    //   prefetch={false}
    // >
    <div className="  cursor-pointer" onClick={onClick}>
      {getComponent()}
    </div>
    // </Link>
  );
};
export default BranchersCard;
