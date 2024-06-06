import { ReactComponent as CurationIcon } from 'src/assets/media/svg2/ic-cc.svg';
import { ReactComponent as InviteIcon } from 'src/assets/media/svg2/ic-invite.svg';
import { ReactComponent as EditIcon } from 'src/assets/media/svg2/icon-edit.svg';
import { ReactComponent as SettingIcon } from 'src/assets/media/svg2/icon-setting.svg';

import { message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { onClickFollowReq } from 'src/api/userSpace';
import UserAvatar from 'src/components/UserAvatar';
import { useExternalLinksReq } from 'src/data/use-user-link-list';
import { UserSpaceInfo } from 'src/data/use-userHome-detail';
import useRouterParams from 'src/hooks/use-router-params';
import useUserInfo from 'src/hooks/use-user-info';
import { publish } from 'src/utils/event';
import AboutModal from '../AboutModal';
import FollowModal from '../FollowModal';

interface Props {
  userInfo: UserSpaceInfo;
  handelClose: (type: number) => void;
  mutateData: () => void;
}
const UserSpaceInfoPage = (props: Props) => {
  const { userInfo, handelClose, mutateData } = props;
  const { userId } = useRouterParams();
  const { t } = useTranslation();

  const { data: currLoginUserInfo } = useUserInfo();

  const router = useRouter();

  const { data = [] } = useExternalLinksReq(userId);

  const [aboutOpen, setAboutOpen] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [openFollowWin, setOpenFollowWin] = useState<boolean>(false);

  const handleCancelCallback = () => {
    setOpenFollowWin(false);
    setAboutOpen(false);
  };

  const showConfirm = async () => {
    if (!currLoginUserInfo) {
      publish('showLoginView');
      return;
    }

    try {
      setCommitLoading(true);
      const res = await onClickFollowReq(userId);
      if (res.data.status) {
        message.success('Success!');
        mutateData();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  return (
    <>
      <div className="p-[20px] border-message border-b text-[16px]">
        <UserAvatar
          size={100}
          faceSize={60}
          isSeedao={userInfo?.seedaoAlias ? true : false}
          logoUrl={userInfo?.faceUrl}
        />
        <div className=" font-[500] text-[25px] my-[16px] flex items-center ">
          {userInfo?.username}
          {userInfo?.canEdit && (
            <EditIcon
              onClick={() => {
                handelClose(2);
              }}
              className="ml-[5px]"
            />
          )}
        </div>
        <div className="flex text-[#696969] ">
          <div
            onClick={() => {
              setOpenFollowWin(true);
            }}
            className="text-[14px] cursor-pointer"
          >
            {/* <MembersIcon className="mr-[5px]" /> */}
            {userInfo?.spaceData?.followedCount}{' '}
            {t('clientUI.userSpaceHome.follower')}
          </div>
          <div
            onClick={() => {
              setOpenFollowWin(true);
            }}
            className="ml-[15px] text-[14px] cursor-pointer"
          >
            {/* <MembersIcon className="mr-[5px]" /> */}
            {userInfo?.spaceData?.followingCount}{' '}
            {t('clientUI.userSpaceHome.following')}
          </div>
        </div>
        <div className="text-first mt-[20px]">
          {userInfo?.bio === '' || !userInfo?.bio
            ? 'Write something about yourself'
            : userInfo?.bio}
          {userInfo?.canEdit && (
            <EditIcon
              className="ml-[10px] cursor-pointer"
              onClick={() => {
                handelClose(2);
              }}
            />
          )}
        </div>

        {userInfo && !userInfo.canEdit && (
          <div className="mt-[20px]">
            <button
              onClick={showConfirm}
              className="button-grey !text-[16px] !font-[500] text-first"
            >
              <InviteIcon className="mr-[10px]" />
              {userInfo?.spaceData?.isFollowing
                ? t('clientUI.userSpaceHome.unFollow')
                : t('clientUI.userSpaceHome.Follow')}
            </button>
          </div>
        )}
      </div>
      <div className="p-[20px] border-message border-b text-first text-[16px]">
        <span className="text-[14px] font-[600]">
          {t('clientUI.userSpaceHome.userData')}
        </span>
        <div className="flex items-center mt-[15px] text-first">
          <div className="flex-1">
            <div className="text-[25px] font-[500] ">
              {(userInfo?.inStream! + userInfo?.outStream!).toFixed(2)}
            </div>
            <div className="text-[14px] mt-[6px]">
              {t('clientUI.userSpaceHome.totalStream')}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[25px] font-[500] ">
              {userInfo?.spaceData?.opusCount}
            </div>
            <div className="text-[14px] text-first mt-[6px]">
              {t('clientUI.userSpaceHome.totalPost')}
            </div>
          </div>
        </div>
      </div>
      {data.length > 0 && (
        <div className="p-[20px]  border-message border-b text-first text-[16px]">
          <span className="text-[14px] font-[600]">
            {t('clientUI.userSpaceHome.socialMedia')}
          </span>
          <div className="flex mt-[15px] gap-[5px] items-center">
            {data.map((item) => (
              <Link key={item.id} href={item.link} target="_blank">
                <img
                  className="w-[30px] h-[30px] rounded-full"
                  src={item.iconUrl}
                  alt=""
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {userInfo?.canEdit && (
        <div className="p-[20px] border-message border-b text-first text-[16px]">
          <span className="text-[14px] font-[600]">
            {t('clientUI.userSpaceHome.setting')}
          </span>
          <div className="mt-[15px]  w-full">
            <div
              onClick={() => {
                router.push('../creatorCenter');
              }}
              className="flex items-center  text-[14px] p-[10px] w-full cursor-pointer hover:bg-[#eee] rounded-[10px]"
            >
              <CurationIcon className="mr-[15px]"></CurationIcon>
              {t('clientUI.creatorCenter.name')}
            </div>
            <div
              onClick={() => {
                handelClose(2);
              }}
              className="flex  text-[14px] items-center p-[10px] w-full cursor-pointer hover:bg-[#eee] rounded-[10px]"
            >
              <SettingIcon className="mr-[15px]"></SettingIcon>
              {t('clientUI.personal.name')}
            </div>
          </div>
        </div>
      )}

      <AboutModal
        open={aboutOpen}
        data={userInfo?.subTitle}
        handleCancel={handleCancelCallback}
      />

      <FollowModal
        open={openFollowWin}
        userInfo={userInfo}
        handleCancelCallback={handleCancelCallback}
      ></FollowModal>
    </>
  );
};

export default UserSpaceInfoPage;
