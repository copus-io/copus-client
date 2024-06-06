import { Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import ImageButton from './ImageButton';

import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ReactComponent as AudioIcon } from 'src/assets/media/svg2/icon-audio.svg';
import { ReactComponent as ImageIcon } from 'src/assets/media/svg2/icon-image.svg';
import { ReactComponent as TextIcon } from 'src/assets/media/svg2/icon-text.svg';
import { ReactComponent as VideoIcon } from 'src/assets/media/svg2/icon-video.svg';
import { publishDraftUUID } from 'src/recoil/publishDraftUUID';

interface Props {
  spaceId?: string;
  close: () => void;
}

const CreateOpus = (props: Props) => {
  const { spaceId, close } = props;
  // const resetPubulishDraftUUIDAtom = useResetRecoilState(pubulishDraftUUID);
  const [, setPublishDraftUUID] = useRecoilState(publishDraftUUID);

  const { t } = useTranslation();
  const router = useRouter();
  const data = [
    {
      title: t('clientUI.createPost.text'),
      icon: <TextIcon />,
      opusType: 10,
      hoverBorder: 'hover:border-[#ffa902]',
    },
    {
      title: t('clientUI.createPost.images'),
      icon: <ImageIcon />,
      opusType: 20,

      hoverBorder: 'hover:border-[#ea7db7]',
    },
    {
      title: t('clientUI.createPost.audio'),
      icon: <AudioIcon />,
      opusType: 30,

      hoverBorder: 'hover:border-[#74b3ce]',
    },
    {
      title: t('clientUI.createPost.video'),
      icon: <VideoIcon />,
      opusType: 40,
      hoverBorder: 'hover:border-[#2b8649]',
    },
  ];
  useEffect(() => {
    setPublishDraftUUID('');
  }, []);
  return (
    <div className={`flex text-first  items-center`}>
      <div className="flex-col flex-1 items-center justify-center   mt-[85px] mb-[80px]">
        <div className="text-[25px]  text-center leading-[34px] font-medium mb-[40px]">
          {t('clientUI.createPost.title')}
        </div>
        <Row justify="space-between" align="top" className="">
          {data.map((item, index) => {
            return (
              <Col span={6} key={item.title}>
                <ImageButton
                  title={item.title}
                  icon={item.icon}
                  hoverBorder={item.hoverBorder}
                  onClick={() => {
                    if (spaceId) {
                      router.push(
                        `/create?type=${index}&spaceId=${spaceId}&cburl=${router.asPath}`
                      );
                    } else {
                      router.push(
                        `/create?type=${index}&cburl=${router.asPath}`
                      );
                    }
                  }}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};
export default CreateOpus;
