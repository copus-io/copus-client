import { memo, useEffect, useState } from 'react';

import clsx from 'clsx';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LinkIcon } from 'src/assets/media/svg/icon-link.svg';
import { ReactComponent as TelegramIcon } from 'src/assets/media/svg/icon-telegram-share.svg';
import { ReactComponent as TwitterIcon } from 'src/assets/media/svg/icon-twitter-share.svg';
import { ReactComponent as WechatIcon } from 'src/assets/media/svg/icon-wechat.svg';
import styles from './index.module.less';

// import { TelegramShareButton, TwitterShareButton } from 'react-share';
import { message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

interface ShareProps {
  handleHideCallback: () => void;
  title: string;
  url?: string;
}

const ShareView = (props: ShareProps) => {
  const getUrl = encodeURIComponent(window.location.href);
  const { handleHideCallback, title } = props;
  /** hook */
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(document.body.clientWidth <= 750);
    window.addEventListener('resize', () => {
      setIsMobile(document.body.clientWidth <= 750);
    });
    return () => window.removeEventListener('resize', () => {});
  }, []);

  return (
    <div
      className={clsx(
        'rounded-[10px] w-[246px] text-third text-[16px] py-[10px]',
        styles.containerView
      )}
    >
      <div>
        <div className={clsx('border-b-[1px] border-border')}>
          <div className="p-[0_10px_10px] text-third">
            <CopyToClipboard
              text={window.location.href}
              onCopy={() => {
                handleHideCallback();

                message.success('Success!!!');
              }}
            >
              <div className="flex p-[10px] items-center  pl-[10px] rounded-[10px] cursor-pointer hover:bg-bg-third/40 duration-300">
                <div className="pr-[16px]">
                  <LinkIcon className="h-[18px] w-[18px] flex items-center" />
                </div>
                {t('clientUI.postDetailInfo.share.copyLink')}
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
      <div className="p-[10px] text-third">
        <div
          className="p-[10px]  rounded-[10px] flex text-third items-center pl-[10px] cursor-pointer hover:bg-bg-third/40 duration-300"
          onClick={() => {
            handleHideCallback();
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
              )}&url=${getUrl}`
            );
          }}
        >
          <div className="pr-[16px] flex items-center">
            <TwitterIcon className="h-[19px] w-[16px] flex items-center" />
          </div>
          {t('clientUI.postDetailInfo.share.shareTwitter')}
        </div>

        <div
          className="p-[10px]   rounded-[10px] flex text-third items-center pl-[10px] cursor-pointer hover:bg-bg-third/40 duration-300"
          onClick={() => {
            handleHideCallback();
            window.open(
              `https://telegram.me/share/url?text=${encodeURIComponent(
                title
              )}&url=${getUrl}`
            );
          }}
        >
          <div className="pr-[16px] flex items-center">
            <TelegramIcon className="h-[19px] w-[16px] flex items-center" />
          </div>
          {t('clientUI.postDetailInfo.share.shareTelegram')}
        </div>
        {!isMobile && (
          <>
            <div className="flex p-[10px] pb-[0px] rounded-[10px] text-third items-start pl-[10px] ">
              <div className="pr-[16px] h-[20px] flex items-center">
                <WechatIcon className="mt-[5px] h-[19px] w-[16px] flex items-center" />
              </div>
              {isMobile
                ? t('clientUI.postDetailInfo.share.shareWeChat')
                : t('clientUI.postDetailInfo.share.shareQRWeChat')}
            </div>
            <div className={clsx('flex justify-center items-center p-[10px]')}>
              <QRCode size={140} value={window.location.href || '-'} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default memo(ShareView);
