import { useSigma } from '@react-sigma/core';
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import { keyBy, omit, size } from 'lodash';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Dataset, FiltersState } from './types';

// https://graphology.github.io/standard-library/layout-forceatlas2.html

const GraphDataController: FC<
  PropsWithChildren<{
    dataset: Dataset;
    filters: FiltersState;
    parentPage?: number;
    type?: boolean;
  }>
> = ({ dataset, parentPage = 0, type = false, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  let params = getGraphParamsByCount(dataset.nodes.length);

  useEffect(() => {
    if (!graph || !dataset) return;

    // const clusters = keyBy(dataset.clusters, 'key');
    const clusters = keyBy(dataset.clusters, 'key');
    const tags = keyBy(dataset.tags, 'key');
    const nodes = dataset.nodes;
    nodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / nodes.length;
      node.x = 1 * Math.cos(angle);
      node.y = 1 * Math.sin(angle);
      graph.addNode(node.key, {
        ...node,
        ...omit(clusters[node.cluster], 'key'),
        //image: `./images/${tags[node.tag].image}`,
      });
    });
    let size = 1;
    if (type) {
      size = 3;
    }
    dataset.edges.forEach(([source, target]) =>
      graph.addEdge(target, source, {
        size,
        // color: '#2192fb66',
        // border: '1px solid #2192fb66',
      })
    );

    // Use degrees as node sizes:
    const scores = graph
      .nodes()
      .map((node: any) => graph.getNodeAttribute(node, 'score'));

    let minDegree = Math.min(...scores);
    let maxDegree = Math.max(...scores);
    if (!type) {
      graph.forEachNode((node: any) => {
        let size =
          ((graph.getNodeAttribute(node, 'score') - minDegree) /
            (maxDegree - minDegree)) *
            (params.maxNodeSize - params.minNodeSize) +
          params.minNodeSize;

        if (!size || size < params.minNodeSize) {
          size = params.minNodeSize;
        }
        graph.setNodeAttribute(node, 'size', size);
      });
    }
    if (parentPage == 3) {
      graph.forEachNode((node: any) => {
        graph.setNodeAttribute(node, 'size', 15);
      });
    }
    const layout = new FA2Layout(graph, {
      settings: {
        adjustSizes: true,
        barnesHutOptimize: true,
        strongGravityMode: false,
        outboundAttractionDistribution: true,
        slowDown: params.slowDown,
        scalingRatio: params.scalingRatio,
        barnesHutTheta: params.barnesHutTheta,
        gravity: params.gravity,
      },
    });
    layout.start();
    setTimeout(() => {
      layout.stop();
    }, params.actionDuration);
    return () => graph.clear();
  }, [graph, dataset]);

  return <>{children}</>;
};

interface GraphParam {
  gravity: number;
  minNodeSize: number;
  maxNodeSize: number;
  scalingRatio: number;
  slowDown: number;
  barnesHutTheta: number;
  actionDuration: number;
}

function getGraphParamsByCount(count: number) {
  console.info('getGraphParamsByCount', count);

  let params: GraphParam = {
    gravity: 0.01,
    minNodeSize: 3,
    maxNodeSize: 10,
    scalingRatio: 0.6,
    slowDown: 0.6,
    barnesHutTheta: 0.6,
    actionDuration: 20 * 1000,
  };

  if (count > 1000) {
    params.gravity = 0.01;
    params.scalingRatio = 0.6;
    params.slowDown = 0.6;
    params.minNodeSize = 3;
    params.maxNodeSize = 10;
    params.actionDuration = 20 * 1000;

    return params;
  }

  if (count > 500) {
    params.gravity = 0.01;
    params.scalingRatio = 1;
    params.slowDown = 10;
    params.barnesHutTheta = 0.9;
    params.minNodeSize = 4;
    params.maxNodeSize = 12;
    params.actionDuration = 20 * 1000;

    return params;
  }

  if (count > 100) {
    params.gravity = 5;
    params.minNodeSize = 5;
    params.maxNodeSize = 20;
    params.scalingRatio = 10;
    params.actionDuration = 8 * 1000;
    params.slowDown = 5;
    return params;
  }

  if (count > 20) {
    params.gravity = 5;
    params.minNodeSize = 8;
    params.maxNodeSize = 20;
    params.scalingRatio = 10;
    params.actionDuration = 5 * 1000;
    params.slowDown = 5;
    return params;
  }

  params.gravity = 1;
  params.minNodeSize = 15;
  params.maxNodeSize = 30;
  params.scalingRatio = 10;
  params.actionDuration = 3 * 1000;
  params.slowDown = 10;

  return params;
}

export default GraphDataController;
