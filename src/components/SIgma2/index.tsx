import { SigmaContainer } from '@react-sigma/core';
import { createNodeImageProgram } from '@sigma/node-image';

import { DirectedGraph } from 'graphology';
import { constant, keyBy, mapValues } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Settings } from 'sigma/settings';
import GraphDataController from './GraphDataController';
import GraphEventsController from './GraphEventsController';
import GraphSettingsController from './GraphSettingsController';
import { drawHover, drawLabel } from './canvas-utils';
import { Dataset, FiltersState } from './types';

interface IProps {
  data: any;
  parentPage?: number;
  height?: number;
  width?: number | string;
  type?: boolean;
}
const SigmaHome = (props: IProps) => {
  const { data, parentPage = 0, height, width, type } = props;
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    tags: {},
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const sigmaSettings: Partial<Settings> = useMemo(
    () => ({
      nodeProgramClasses: {
        image: createNodeImageProgram(),
      },
      defaultDrawNodeLabel: drawLabel,
      defaultDrawNodeHover: drawHover,
      defaultNodeType: 'image',
      defaultEdgeType: 'arrow',
      defaultNodeLabelCSSClass: 'graph-label',
      labelDensity: 1,
      labelGridCellSize: 60,
      allowInvalidContainer: true,
      labelRenderedSizeThreshold: 15,
      zIndex: true,
    }),
    []
  );

  // Load data on mount:
  useEffect(() => {
    console.log('~log============dataset====data=======', data);
    if (data && data[0]) {
      const dataset: any = data[0];
      setDataset(dataset);
      setFiltersState({
        clusters: mapValues(keyBy(dataset.clusters, 'key'), constant(true)),
        tags: mapValues(keyBy(dataset.tags, 'key'), constant(true)),
      });
      requestAnimationFrame(() => setDataReady(true));
    }
  }, [data]);

  if (!dataset) return null;

  return (
    <div
      className="w-full h-full relative"
      style={
        parentPage === 0
          ? {
              height: '1000px',
              width: '1400px',
            }
          : {
              height: height ? `calc(100vh - ${height}px)` : '100%',
              width: width ? width : '100%',
            }
      }
    >
      <SigmaContainer
        graph={DirectedGraph}
        settings={sigmaSettings}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} />
        <GraphDataController
          dataset={dataset}
          parentPage={parentPage}
          filters={filtersState}
          type={type}
        />
      </SigmaContainer>
    </div>
  );
};

export default SigmaHome;
