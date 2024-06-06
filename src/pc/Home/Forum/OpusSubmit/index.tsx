import { Space, Spin } from 'antd';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { ReactComponent as ChangeIcon } from 'src/assets/media/svg2/icon-change.svg';
import { ReactComponent as FacebookIcon } from 'src/assets/media/svg2/icon-share-facebook.svg';
import { ReactComponent as TwitterIcon } from 'src/assets/media/svg2/icon-share-twitter.svg';
import { ReactComponent as WechatIcon } from 'src/assets/media/svg2/icon-share-wechat.svg';
import SpaceItem from 'src/components/SubmitSpaceItem';

import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LinkIcon } from 'src/assets/media/svg2/icon-share-link.svg';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import useSpacesCanSubmitListReq from 'src/data/use-opus-spacesCanSubmit-list';
import { publish } from 'src/utils/event';

const OpusSubmit = () => {
  const { t } = useTranslation();
  const [spacesList, setSpacesList] = useState<SpaceMetaInfo[]>([]);
  const opusId = router.query.opusId as string;
  const opusUuid = router.query.uuid as string;

  const { data, size, isValidating, setSize } = useSpacesCanSubmitListReq({
    pageSize: 3,
    uuid: opusUuid,
  });

  useEffect(() => {
    if (data) {
      setSpacesList(([] as SpaceMetaInfo[]).concat(data[size - 1]));
      // loadFlagRef.current = true;
    }
  }, [data]);

  const shareItems = [
    {
      title: 'X',
      icon: <TwitterIcon />,
    },
    {
      title: 'Facebook',
      icon: <FacebookIcon />,
    },
    {
      title: 'WeChat',
      icon: <WechatIcon />,
    },
    {
      title: 'Copy link',
      icon: <LinkIcon />,
    },
  ];
  return (
    <div className="flex-col items-center justify-center">
      <div className="text-[38px]  text-center leading-[130%] font-[500] mb-[15px] mt-[20px]">
        {t('clientUI.opusSubmit.title')}
      </div>
      <div className="text-center text-[18px] leading-[130%]  mb-[10px]">
        <div>
          {t('clientUI.opusSubmit.toSpace1')}{' '}
          <Link className="underline" href={'/work/' + opusUuid}>
            {t('clientUI.opusSubmit.toSpace2')}
          </Link>
        </div>
      </div>
      <div className="w-[590px] px-[10px]">
        <Spin
          spinning={isValidating}
          indicator={
            <SyncOutlined style={{ fontSize: 34, color: '#696969' }} spin />
          }
        >
          {spacesList.length === 0 && <div className="h-[324px]"></div>}
          <Space direction="vertical" size={0} className="w-full">
            {spacesList?.map((item, index) => {
              return (
                <div key={index}>
                  <SpaceItem opusId={Number(opusId)} item={item} />
                </div>
              );
            })}
          </Space>
        </Spin>

        <div className="flex flex-col items-center mt-[15px]">
          <div
            className="flex items-center justify-center cursor-pointer "
            onClick={() => {
              setSize(size + 1);
            }}
          >
            <div className=" w-[15px] h-[15px] p-[2px] rounded-[50px] bg-[#696969] flex items-center justify-center">
              <ChangeIcon></ChangeIcon>
            </div>
            <div className="ml-[6px] text-[#696969] text-[14px] leading-[23px]">
              {t('clientUI.showBatch')}
            </div>
          </div>
          <div
            onClick={() => {
              publish('OpusSubmit_Close');
            }}
            className="text-center text-[14px] text-[#696969] leading-[130%] mt-[5px] underline underline-offset-2 cursor-pointer"
          >
            {t('clientUI.curatorCenter.viewAllSpaces')}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center text-[18px] leading-[30px] my-[20px]">
            {t('clientUI.opusSubmit.share')}
          </div>
          <Space align="center" size={30}>
            {shareItems.map((item, index) => {
              return (
                <div key={item.title}>
                  <div
                    className="flex flex-col items-center justify-center overflow-hidden cursor-pointer"
                    style={{}}
                    onClick={() => {}}
                  >
                    <div className="w-[40px] h-[40px]">{item.icon}</div>
                    <div className="text-center text-[14px] text-[#696969] leading-[130%]  mt-[5px] ">
                      {item.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </Space>
        </div>
      </div>
    </div>
  );
};
export default OpusSubmit;
