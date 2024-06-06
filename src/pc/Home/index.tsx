import { Tabs } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as GraphIconGray } from 'src/assets/media/svg2/icon-home-graph-gray.svg';
import { ReactComponent as GraphIcon } from 'src/assets/media/svg2/icon-home-graph.svg';
import Forum from './Forum';
import Graph from './Graph';
import styles from './index.module.less';

const Home = () => {
  const { t } = useTranslation();

  const tabsData = [
    { title: t('clientUI.home.forumView'), view: <Forum /> },
    { title: t('clientUI.home.graphView'), view: <Graph /> },
  ];
  const [activeKey, setActiveKey] = useState('1');
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className="pl-[10px]">
      <Tabs
        onChange={onChange}
        className={styles.tabs}
        type="card"
        hideAdd={true}
        items={[
          {
            label: (
              <div
                className={clsx(
                  '!py-[8px]',
                  'text-first',
                  activeKey === '1'
                    ? 'border-b-4 border-[#393939]  font-[500]'
                    : 'border-b-4 border-[transparent]  font-[400]'
                )}
                style={{
                  filter: `${
                    activeKey === '1' ? 'opacity(1) ' : 'opacity(0.5)'
                  }`,
                }}
              >
                <span className="text-[24px] font-[500] mx-[10px] ">
                  {tabsData[0].title}
                </span>
              </div>
            ),
            key: '1',
            children: tabsData[0].view,
            animated: false,
          },
          {
            label: (
              <div
                className={clsx(
                  'flex items-center justify-center text-first !py-[8px]',
                  activeKey === '2'
                    ? 'border-b-4 border-[#ea7db7]  !text-[#ea7db7]  font-[500]'
                    : 'border-b-4 border-[transparent]  font-[400]'
                )}
                style={{
                  filter: `${
                    activeKey === '2' ? 'opacity(1) ' : 'opacity(0.5)'
                  }`,
                }}
              >
                {activeKey === '2' ? (
                  <GraphIcon width={23} height={22} />
                ) : (
                  <GraphIconGray width={23} height={22} />
                )}
                <span className="text-[24px]   font-[500] mx-[10px] ">
                  {tabsData[1].title}
                </span>
              </div>
            ),
            key: '2',
            children: tabsData[1].view,
            animated: false,
          },
        ]}
      />
    </div>
  );
};

export default Home;
