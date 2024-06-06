import { Tabs } from 'antd';
import styles from './index.module.less';

import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Posts from './Posts';
import Spaces from './Spaces';

const CreatorCenter = () => {
  const { t } = useTranslation();

  const tabsData = [
    { title: t('clientUI.creatorCenter.posts'), view: <Posts></Posts> },
    { title: t('clientUI.creatorCenter.spaces'), view: <Spaces></Spaces> },
  ];

  const [activeKey, setActiveKey] = useState('1');
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className="flex flex-col  w-full justify-center items-center">
      <div className=" w-[1350px] ">
        <div className="flex items-center justify-center w-full text-center mt-[30px] text-first font-[500] text-[25px]">
          {t('clientUI.creatorCenter.name')}
        </div>
        <Tabs
          activeKey={activeKey}
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
                      ? 'border-b-4 border-[#393939]  font-[500]   !text-[#231f20]'
                      : 'border-b-4 border-[transparent]  font-[400] !text-[#a9a9a9]'
                  )}
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
                      ? 'border-b-4 border-[#393939]  font-[500]  !text-[#231f20]'
                      : 'border-b-4 border-[transparent]  font-[400]  !text-[#a9a9a9]'
                  )}
                >
                  <span className="text-[24px] font-[500] mx-[10px] ">
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
      </div>{' '}
    </div>
  );
};

export default CreatorCenter;
