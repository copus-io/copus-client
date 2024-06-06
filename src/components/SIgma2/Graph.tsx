import SigmaHome from 'src/components/SIgma2';
import SigmaLoading from 'src/components/SIgma2/loading';
interface IProps {
  data: any;
  isLoading: boolean;
  parentPage?: number;
  height?: number;
  width?: number | string;
  type?: boolean;
}
const Graph = (props: IProps) => {
  const { data, parentPage = 0, height, isLoading, width, type } = props;
  // const { userId } = useRouterParams();
  // const { data, isLoading } = useHomeGraphDataList(userId, 2);
  // console.log('~log=======================', data);
  return (
    <div className="w-full h-full">
      {isLoading && parentPage < 3 && <SigmaLoading />}
      <div className="w-full h-full">
        <SigmaHome
          data={data}
          parentPage={parentPage}
          height={height}
          width={width}
          type={type}
        ></SigmaHome>
      </div>
    </div>
  );
};

export default Graph;
