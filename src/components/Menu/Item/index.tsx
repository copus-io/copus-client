import { Badge, Popover } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CreatorCenterIcon } from 'src/assets/media/svg2/ic-cc.svg';
import { ReactComponent as ArrowIcon } from 'src/assets/media/svg2/icon-create-arrow.svg';
import { ReactComponent as HomeIcon } from 'src/assets/media/svg2/icon-home.svg';
import { ReactComponent as NotificationIcon } from 'src/assets/media/svg2/icon-notification.svg';
import { ReactComponent as AddIcon } from 'src/assets/media/svg2/icon-plus.svg';
import { ReactComponent as SettingIcon } from 'src/assets/media/svg2/icon-setting.svg';
import { CommonModal } from 'src/components/ModalPro';
import { userUnreadMsgCount } from 'src/data/use-user-info';
import useUserInfo from 'src/hooks/use-user-info';
import NotificationView from 'src/pc/modalViews/NotificationView';
import UserSetting from 'src/pc/modalViews/UserSetting';
import { subscribe } from 'src/utils/event';
import styles from './index.module.less';

interface IProps {
  handelCreate: (tag: number) => void;
}

const Item = (prop: IProps) => {
  const { t } = useTranslation();
  const { handelCreate } = prop;
  const menuItemList = [
    {
      name: t('clientUI.home.name'),
      router: 'home',
      icon: <HomeIcon className="w-[15px] h-[15px]"></HomeIcon>,
    },
    {
      name: t('clientUI.creatorCenter.name'),
      router: 'creatorCenter',
      icon: (
        <CreatorCenterIcon className="w-[15px] h-[15px]"></CreatorCenterIcon>
      ),
    },
    {
      name: t('clientUI.notification.name'),
      router: 'Notification',
      icon: <NotificationIcon className="w-[15px] h-[15px]"></NotificationIcon>,
    },
    // {
    //   name: t('clientUI.myStream'),
    //   // name: 'My stream',
    //   router: 'My stream',
    //   icon: <StreamIcon></StreamIcon>,
    // },
    {
      name: t('clientUI.setting'),
      router: 'Setting',
      icon: <SettingIcon className="w-[15px] h-[15px]"></SettingIcon>,
    },
  ];
  const { data: userInfo } = useUserInfo();
  const [unreadMsgCount, setUnReadMsgCount] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [freshMsgCount, setFreshMsgCount] = useState(0);
  const [openPersonSetting, setOpenPersonSetting] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const createSpace = (tag: number) => {
    handelCreate(tag);
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleCancelCallback = () => {
    setOpenPersonSetting(false);
    setOpenNotificationModal(false);
  };

  useEffect(() => {
    subscribe('freshMsgCount', () => {
      setFreshMsgCount(freshMsgCount + 1);
    });
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    userUnreadMsgCount().then((resp) => {
      setUnReadMsgCount(resp);
    });
  }, [freshMsgCount]);

  return (
    <div className="py-[15px]">
      <div className="itemCom pb-[10px] px-[20px] border-b-[1px]">
        <div className="Start mb-[20px]">
          <Popover
            trigger="click"
            placement="bottom"
            open={open}
            overlayClassName={styles.editor}
            onOpenChange={handleOpenChange}
            content={
              <div
                className="w-[160px]"
                style={{
                  boxShadow: '1px 1px 10px 0 rgba(118, 118, 118, 0.4)',
                }}
              >
                <div
                  className={clsx(
                    styles.boxDiv,
                    'border-border cursor-pointer text-[#231f20] text-[14px]  border-b-[1px] px-[20px] py-[15px] justify-between bg-bg-[rgba(228, 224, 224, 0.4)] flex items-center'
                  )}
                  onClick={() => createSpace(1)}
                >
                  {t('clientUI.startCreating.post')}
                  <ArrowIcon />
                </div>
                <div
                  className={clsx(
                    styles.boxDiv,
                    'cursor-pointer text-[#231f20] text-[14px]  border-b-[1px] px-[20px] py-[15px] justify-between bg-bg-[rgba(228, 224, 224, 0.4)] flex items-center'
                  )}
                  onClick={() => createSpace(2)}
                >
                  {t('clientUI.startCreating.space')}
                  <ArrowIcon />
                </div>
              </div>
            }
          >
            <div>
              <div className="flex items-center justify-center h-[43px] text-[#fff] bg-[#f21000] rounded-full cursor-pointer">
                <AddIcon className="mr-[6px]"></AddIcon>
                {t('clientUI.startCreating.name')}
              </div>
            </div>
          </Popover>
        </div>

        {menuItemList.map((item, index) => (
          <div className="font-[14px] text-[#231f20]" key={index}>
            {itemEvent(item)}
          </div>
        ))}
      </div>

      {openPersonSetting && (
        <CommonModal
          handleCancelCallback={handleCancelCallback}
          title={t('clientUI.personal.name')}
        >
          <UserSetting />
        </CommonModal>
      )}

      {openNotificationModal && (
        <CommonModal handleCancelCallback={handleCancelCallback}>
          <NotificationView />
        </CommonModal>
      )}
    </div>
  );

  function itemEvent(item: any) {
    let btnStyle =
      'flex items-center gap-[15px] rounded-[15px] pl-[10px] py-[10px] hover:bg-[#eee] cursor-pointer';

    if (item.router === 'Setting') {
      return (
        <div
          onClick={() => {
            setOpenPersonSetting(true);
          }}
          className={btnStyle}
        >
          {item.icon}
          {item.name}
        </div>
      );
    }

    if (item.router === 'Notification') {
      return (
        <div
          onClick={() => {
            setOpenNotificationModal(true);
          }}
          className="flex items-center rounded-[15px] pl-[10px] py-[10px] hover:bg-[#eee] cursor-pointer"
        >
          <div className="flex items-center gap-[15px]">
            {item.icon}
            {item.name}
          </div>
          <Badge
            count={unreadMsgCount}
            color="secondary"
            offset={[2, -10]}
          ></Badge>
        </div>
      );
    }

    return (
      <Link
        href={`/${item.router}`}
        className={clsx(
          'flex items-center gap-[15px] rounded-[15px] pl-[10px] py-[10px] hover:bg-[#eee]',
          item.name === 'Home' ? 'bg-[#f3f3f3]' : ''
        )}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  }
};
export default Item;
