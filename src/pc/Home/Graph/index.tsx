import SigmaHome from 'src/components/SIgma2';
import useHomeGraphDataList from 'src/data/use-space-graphData-list';
import SigmaLoading from 'src/components/SIgma2/loading';

const Graph = () => {
  const { data, isLoading } = useHomeGraphDataList();

  return (
    // pointer-events-none select-none
    <div className="w-full h-full">
      {isLoading && <SigmaLoading />}
      <div className="w-full h-full">
        <SigmaHome data={data} width={1400}></SigmaHome>
      </div>
    </div>
  );
};

export default Graph;
