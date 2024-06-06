// https://app.zeplin.io/project/65dfeff4065151651326d684/screen/66186693fdeb5b4e47f2cc23

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalPro from 'src/components/ModalPro';
import { UserSpaceInfo } from 'src/data/use-userHome-detail';
import FollowerList from './FollowerList';
import FollowingList from './FollowingList';
import styles from './index.module.less';

interface FollowModalProps {
  open: boolean;
  userInfo: UserSpaceInfo;
  handleCancelCallback: () => void;
}

export default function FollowModal(props: FollowModalProps) {
  const { open, userInfo, handleCancelCallback } = props;
  const onCancel = async () => {
    handleCancelCallback();
  };

  const { t } = useTranslation();

  let tags = [
    t('clientUI.userSpaceHome.follower'),
    t('clientUI.userSpaceHome.following'),
  ];

  const [selectedTagIndex, setSelectedTagIndex] = useState(0);

  function onClickTag(index: number) {
    setSelectedTagIndex(index);
  }
  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        width={960}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        wrapClassName={styles.modalPro1}
        getContainer=".cascade_con"
        footer={false}
      >
        {contentView()}
      </ModalPro>
    </div>
  );

  function contentView() {
    return (
      <div className="h-[calc(72vh)]">
        <div className="flex gap-[20px] text-[16px] text-[#231f20]">
          {tags.map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  onClickTag(index);
                }}
                className={
                  selectedTagIndex === index
                    ? 'bg-[#f3f3f3]  font-[600] px-[15px] py-[8px] rounded-full'
                    : 'bg-white font-[500] px-[15px] py-[8px] rounded-full'
                }
              >
                {item}
              </button>
            );
          })}
        </div>
        {selectedTagIndex === 0 ? (
          <FollowerList isFirst={true} />
        ) : (
          <FollowingList canEdit={userInfo.canEdit} />
        )}
      </div>
    );
  }
}
