import { useState } from 'react';
import { onJoinSpaceReq } from 'src/api/userSpace';
import { ReactComponent as CurationIcon } from 'src/assets/media/svg2/ic-cc.svg';
import { ReactComponent as InviteIcon } from 'src/assets/media/svg2/ic-invite-white.svg';
import { ReactComponent as MembersIcon } from 'src/assets/media/svg2/ic-members.svg';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as EditIcon } from 'src/assets/media/svg2/icon-edit.svg';
import { ReactComponent as SettingIcon } from 'src/assets/media/svg2/icon-setting.svg';
import {
  SpaceMemberInfo,
  useExternalLinksReq,
  useSpaceMemberInfoReq,
} from 'src/data/use-space-link-list';
import useRouterParams from 'src/hooks/use-router-params';
import AboutModal from '../AboutModal';
import styles from './index.module.less';

import { message } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { showInfoTip, spaceLogo, userFace } from 'src/components/common';
import { SpaceDetailInfo } from 'src/data/use-space-detail';
import useUserInfo from 'src/hooks/use-user-info';
import { publish } from 'src/utils/event';

interface Props {
  spaceDetail: SpaceDetailInfo;
  handelOpen: (type: number) => void;
  mutateData: () => void;
}
const SpaceInfo = (props: Props) => {
  const { t } = useTranslation();
  const { spaceDetail, handelOpen, mutateData } = props;
  const { data: userInfo } = useUserInfo();
  const { spaceId } = useRouterParams();
  const { data = [] } = useExternalLinksReq(spaceId);
  const { data: adminList } = useSpaceMemberInfoReq(spaceId);

  // 描述
  const [aboutOpen, setAboutOpen] = useState(false);
  // 关闭弹框
  const handleCloseAboutModal = () => {
    setAboutOpen(false);
  };

  const joinSpace = async () => {
    if (!userInfo) {
      publish('showLoginView');
      return;
    }

    try {
      const res = await onJoinSpaceReq(spaceId);
      if (res.data.status) {
        message.success('Success!');
        mutateData();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
    }
  };

  function isSpaceAdmin(): boolean {
    if (userInfo) {
      if (spaceDetail?.role === 0 || spaceDetail?.role === 10) {
        return true;
      }
    }
    return false;
  }

  function isShowJoinBtn(): boolean {
    if (spaceDetail.accessLevel! < 20) {
      if (spaceDetail?.role != 0) {
        return true;
      }
    }
    return false;
  }

  function isPrivateSpaceAdmin(): boolean {
    if (userInfo) {
      if (
        spaceDetail?.accessLevel === 20 &&
        (spaceDetail?.role === 0 || spaceDetail?.role === 10)
      ) {
        return true;
      }
    }
    return false;
  }

  const showJoinBtn = isShowJoinBtn();
  const showInviteBtn = isPrivateSpaceAdmin();

  return (
    <div className="pl-[20px] pr-[5px] pt-[20px]">
      <div className="pl-[20px] pt-[10px] pb-[25px] border-message border-b text-[16px]">
        {spaceLogo(
          spaceDetail?.space?.logoUrl,
          spaceDetail.title,
          100,
          'text-[60px]'
        )}
        <div className="font-[500] text-[25px] my-[16px]">
          {spaceDetail?.title}
        </div>
        <div className="flex text-third">
          <div className="flex-1 flex items-center ">
            <MembersIcon className="mr-[5px]" />
            <div>
              {spaceDetail?.space?.userCount}{' '}
              {t('clientUI.curatorSpaceHome.subscribers')}
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <PostIcon className="mr-[5px]" />
            <div>
              {spaceDetail?.downstreamCount}{' '}
              {t('clientUI.curatorSpaceHome.posts')}
            </div>
          </div>
        </div>
        <div className="mt-[10px] pr-[20px]">
          <span className="break-words">
            {spaceDetail?.subTitle === ''
              ? t('clientUI.spaceSetting.general.aboutTips')
              : spaceDetail?.subTitle}
          </span>

          {isSpaceAdmin() && (
            <EditIcon
              className="ml-[6px] cursor-pointer"
              onClick={() => setAboutOpen(true)}
            />
          )}
        </div>

        <div
          className={clsx(
            'flex items-center',
            showInviteBtn || showJoinBtn ? 'mt-[20px]' : ''
          )}
        >
          {showJoinBtn && (
            <div>
              {spaceDetail?.role === -1 && (
                <button onClick={joinSpace} className={styles.joins}>
                  {spaceDetail?.accessLevel === 0
                    ? t('clientUI.curatorSpaceHome.join')
                    : t('clientUI.curatorSpaceHome.requestToJoin')}
                </button>
              )}
              {spaceDetail?.role > -1 && (
                <div className={styles.joins}>
                  {t('clientUI.curatorSpaceHome.joined')}
                </div>
              )}
              {spaceDetail?.role === -2 && (
                <div className={styles.joins}>
                  {t('clientUI.curatorSpaceHome.requestSent')}
                </div>
              )}
            </div>
          )}

          {showInviteBtn && (
            <button
              onClick={() => {
                handelOpen(2);
              }}
              className={styles.invite}
            >
              <InviteIcon className="mr-[10px]" />
              <div>{t('clientUI.curatorSpaceHome.invite')}</div>
            </button>
          )}
        </div>
      </div>
      <div className="py-[20px] px-[20px] border-message border-b text-first text-[16px]">
        <span className="text-[14px] font-[600]">
          {t('clientUI.curatorSpaceHome.spaceFinance')}
        </span>
        <div className="flex items-center mt-[15px]">
          <div className="flex-1">
            <div className="text-[25px] font-[500] text-first">
              {spaceDetail?.space?.taxRatio
                ? spaceDetail?.space?.taxRatio * 100
                : '-'}
              %
            </div>
            <div className="flex gap-[2px]">
              <div className="text-[14px] mt-[6px]">
                {t('clientUI.curatorSpaceHome.spaceTaxRate')}
              </div>
              {showInfoTip(
                'Space tax is charged for payments directly resulting from exposure provided by the space.',
                'w-[250px]'
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[25px] font-[500] text-first">
              {spaceDetail.rewardAmount! | 0}
            </div>
            <div className="flex gap-[2px]">
              <div className="text-[14px] mt-[6px]">
                {t('clientUI.curatorSpaceHome.spaceTotalStream')}
              </div>
              {showInfoTip('The total amount of Drips streamed in this space.')}
            </div>
          </div>
        </div>
      </div>

      {data.length > 0 && (
        <div className="py-[20px] px-[20px] border-message border-b text-first text-[16px]">
          <span className="text-[14px] font-[600]">
            {t('clientUI.spaceSetting.externalLinks.name')}
          </span>
          <div className="flex mt-[15px] gap-[10px] items-center">
            {data.map((item: any) => (
              <Link key={item.id} href={item.link} target="_blank">
                <img
                  className="rounded-full w-[30px] h-[30px]"
                  src={item.iconUrl}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="pt-[20px] px-[20px] border-message border-b text-first text-[16px]">
        <span className="text-[14px] font-[600]">
          {t('clientUI.curatorSpaceHome.admins')}
        </span>
        <div
          className="flex mt-[15px] items-center "
          style={{
            flexWrap: 'wrap',
          }}
        >
          {adminList?.map((item: SpaceMemberInfo) => (
            <Link
              className="flex items-center w-[50%] mb-[20px]"
              key={item.id}
              href={'user/' + item.namespace}
              target="blank"
            >
              {userFace(item.faceUrl, 'w-[36px] h-[36px]', 'w-[20px] h-[22px]')}
              <div className="ml-[8px]">
                <div className="text-[14px] text-shadow-base">
                  {item.username}
                </div>
                {item.role === 0 ? (
                  <div className="text-[12px]">
                    {t('clientUI.curatorSpaceHome.spaceCreator')}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {isSpaceAdmin() && (
        <div className="py-[20px] px-[20px] border-message border-b text-first text-[16px]">
          <span className="text-[14px] font-[600]">
            {t('clientUI.curatorSpaceHome.adminsOnly')}
          </span>
          <div className="mt-[15px]  w-full">
            <div
              onClick={() => {
                handelOpen(4);
              }}
              className="flex items-center  text-[14px] p-[10px] w-full cursor-pointer hover:bg-[#eee] rounded-[10px]"
            >
              <CurationIcon className="w-[18px] h-[18px] mr-[20px]"></CurationIcon>
              {t('clientUI.curatorCenter.name')}
            </div>
            <div
              onClick={() => {
                handelOpen(3);
              }}
              className="flex  text-[14px] items-center p-[10px] w-full cursor-pointer hover:bg-[#eee] rounded-[10px]"
            >
              <SettingIcon className="w-[18px] h-[18px] mr-[20px]"></SettingIcon>
              {t('clientUI.spaceSetting.name')}
            </div>
          </div>
        </div>
      )}
      <AboutModal
        open={aboutOpen}
        data={spaceDetail?.subTitle}
        handleCancel={handleCloseAboutModal}
      />
    </div>
  );
};

export default SpaceInfo;
