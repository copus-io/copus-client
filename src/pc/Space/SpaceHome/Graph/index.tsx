import SigmaHome from 'src/components/SIgma2';
import SigmaLoading from 'src/components/SIgma2/loading';
import useHomeGraphDataList from 'src/data/use-space-graphData-list';
import useRouterParams from 'src/hooks/use-router-params';
const Graph = () => {
  const { spaceId } = useRouterParams();
  const { data, isLoading } = useHomeGraphDataList(spaceId, 1);

  return (
    // pointer-events-none select-none
    <div>
      {isLoading && <SigmaLoading />}
      <div className="w-full h-full">
        <SigmaHome data={data} parentPage={1} height={130}></SigmaHome>
      </div>
    </div>
  );
};

export default Graph;
