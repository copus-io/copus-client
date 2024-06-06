import { useEffect, useState } from 'react';
import GraphDom from 'src/components/SIgma2/Graph';

const Graph = ({ data, baseData }: { data: any[]; baseData: any }) => {
  let Graph = {};
  const clusters = [
    {
      color: '#ffa902',
      clusterLabel: 'text',
      key: '10',
    },
    {
      color: '#ea7db7',
      clusterLabel: 'image',
      key: '20',
    },
    {
      color: '#74b3ce',
      clusterLabel: 'audio',
      key: '30',
    },
    {
      color: '#2b8649',
      clusterLabel: 'video',
      key: '40',
    },
  ];
  let nodes: any[] = [];
  let edges: any[] = [];
  let tags: any[] = [];
  const [graphData, setGraphData] = useState<any[]>([]);
  useEffect(() => {
    if (baseData) {
      console.log(
        '~log==============baseData======baseData===',
        baseData,
        data
      );
      nodes = [];
      nodes.push({
        size: 23,
        key: baseData?.uuid || baseData?.id,
        uuid: baseData?.uuid || baseData?.id,
        url: '/work/' + baseData?.uuid || baseData?.id,
        label: baseData?.title,
        score: 1,
        cluster: baseData.opusType || '10',
        tag: '',
      });
    }
    if (data.length > 0) {
      data.map((item: any) => {
        nodes.push({
          size: 23,
          key: item?.uuid || item?.id,
          uuid: item?.uuid || item?.id,
          url: '/work/' + item?.uuid || item?.id,
          label: item?.ratio
            ? item?.title + '(' + Math.round(item.ratio * 100) + '%)'
            : item?.title,
          score: 1,
          cluster: item.opusType || '10',
          tag: '',
        });
        edges.push([baseData?.uuid, item.uuid || item?.id]);
      });
    }
    Graph = {
      nodes,
      edges,
      tags,
      clusters,
    };
    setGraphData([Graph]);
  }, [data, baseData]);

  return (
    <>
      <GraphDom data={graphData} isLoading={true} parentPage={3} type={true} />
    </>
  );
};

export default Graph;
