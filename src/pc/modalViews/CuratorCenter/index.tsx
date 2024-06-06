import { Switch } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateSpaceReq } from 'src/api/space';
import useSpaceDetailReq from 'src/data/use-space-detail';
import Accepted from './Accepted';
import NewSubmission from './NewSubmission';
import styles from './index.module.less';

export default function CuratorCenter({ spaceId }: { spaceId: string }) {
  const { t } = useTranslation();
  const tags = [
    { title: t('clientUI.curatorCenter.newSubmission') },
    { title: t('clientUI.curatorCenter.accepted') },
  ];
  const [selectTagIndex, setSelectTagIndex] = useState(0);
  const [fresh, setFresh] = useState(0);

  console.info(spaceId);

  const { data: spaceDetail, mutate: spaceMutate } = useSpaceDetailReq(spaceId);

  return (
    <div className="flex-col">
      <div className="flex items-center justify-between w-full  my-[20px]  ">
        <div className="text-center text-first font-[500] text-[25px] ">
          {t('clientUI.curatorCenter.name')}
        </div>
        <div className="flex gap-[10px] mr-[20px]">
          <div className="text-[#696969] text-[14px]">
            {t('clientUI.curatorCenter.autoAccept')}
          </div>
          <Switch
            value={!spaceDetail?.space?.opusCheckIn!}
            onChange={async () => {
              spaceDetail!.space!.opusCheckIn =
                !spaceDetail?.space?.opusCheckIn;
              setFresh(fresh + 1);
              await updateSpaceReq(
                {
                  opusCheckIn: spaceDetail!.space!.opusCheckIn,
                },
                spaceId
              );
              spaceMutate();
            }}
          ></Switch>
        </div>
      </div>

      <div className="flex items-center gap-[15px] text-[14px] text-[#a9a9a9]">
        {tags.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(index === selectTagIndex ? 'text-first' : '')}
              onClick={() => {
                setSelectTagIndex(index);
              }}
            >
              <div
                className={clsx(
                  index === selectTagIndex
                    ? styles.buttonTagSelect
                    : styles.buttonTag
                )}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-[calc(75vh-150px)]">{list()}</div>
    </div>
  );

  function list() {
    if (selectTagIndex === 0) {
      return <NewSubmission spaceId={spaceId}></NewSubmission>;
    }
    if (selectTagIndex === 1) {
      return <Accepted spaceId={spaceId}></Accepted>;
    }
  }
}
