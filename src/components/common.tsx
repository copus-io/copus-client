import { InfoCircleFilled } from '@ant-design/icons';
import { Popover, Spin } from 'antd';
import clsx from 'clsx';
import { NextRouter } from 'next/router';
import React from 'react';
import { ReactComponent as FaceIcon } from 'src/assets/media/svg2/ic-face.svg';
import { ReactComponent as MembersIcon } from 'src/assets/media/svg2/ic-members.svg';
import { ReactComponent as PostsIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { colorConvert, floorFixedNumber } from 'src/utils/common';
import {
  CHECKED_BACKGROUND_OPACITY,
  NORMAL_BACKGROUND_OPACITY,
} from 'src/utils/statics';

// getBackUrl
export function getBackUrl(router: NextRouter): string {
  let path = router.asPath;
  if (path) {
    return path;
  }
  return '/';
}

export function userFace(
  url?: string,
  clzName = 'w-[45px] h-[45px]',
  iconClzName = 'w-[18px] h-[20px]'
) {
  if (url === null || url === undefined || url.trim().length === 0) {
    return (
      <div
        className={clsx(
          'flex justify-center items-center rounded-full bg-[#eee]',
          clzName
        )}
      >
        <FaceIcon className={iconClzName} />
      </div>
    );
  } else {
    return <img className={clsx(clzName, 'rounded-full')} src={url} />;
  }
}

export function spaceParams(
  rewardAmount?: number,
  userCount?: number,
  downstreamCount?: number
) {
  return (
    <div className="flex gap-[15px]  text-[14px] text-[#696969]">
      <div className="flex gap-[5px] items-center">
        <StreamIcon />
        {floorFixedNumber(rewardAmount || 0, 2)}
      </div>
      <div className="flex gap-[5px] items-center">
        <MembersIcon></MembersIcon>
        {userCount}
      </div>
      <div className="flex gap-[5px] items-center">
        <PostsIcon></PostsIcon>
        {downstreamCount}
      </div>
    </div>
  );
}

export function spaceLogo(
  logoUrl?: string,
  title?: string,
  size: number = 40,
  textStyle: React.ReactNode = 'text-[24px]'
) {
  if (logoUrl) {
    return (
      <img
        className="rounded-full border flex justify-center items-center"
        style={{ width: size, height: size }}
        src={logoUrl}
      />
    );
  } else {
    return (
      <div
        className={clsx(
          'font-[600] text-[#000] flex items-center justify-center border rounded-full bg-[#fff]',
          textStyle
        )}
        style={{ width: size, height: size }}
      >
        {title!.substring(0, 1).toUpperCase()}
      </div>
    );
  }
}

export function postCover(
  logoUrl?: string,
  title?: string,
  size: number = 40,
  textStyle: React.ReactNode = 'text-[24px]'
) {
  return (
    <div
      className="border flex justify-center items-center"
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        <img
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
          src={logoUrl}
        />
      ) : (
        <div className={clsx('font-[600] text-[#000]', textStyle)}>
          {title!.substring(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  );
}

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.01)',
  borderRadius: 4,
};

export function loadingView() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spin tip="Loading" size="large">
        <div style={contentStyle}></div>
      </Spin>
    </div>
  );
}

export function listViewLoadMore(
  isLoadingMore?: boolean,
  isReachingEnd?: boolean,
  setSize?: Function,
  size?: number,
  t?: any
) {
  return (
    <div className="h-[80px] flex items-center justify-center text-first">
      {isLoadingMore ? (
        <div>
          <span className="mr-2">
            <i className="fa fa-circle-o-notch fa-spin " />
          </span>
          {t('clientUI.loading')}
        </div>
      ) : isReachingEnd ? (
        // t('clientUI.spaceSetting.users.reaching')
        ''
      ) : (
        <span
          className="shrink-0 cursor-pointer"
          onClick={() => setSize!(size! + 1)}
        >
          {t('clientUI.loadMore')}
        </span>
      )}
    </div>
  );
}

export function emptyDataTips() {
  return (
    <div
      className={`w-full h-full flex items-center justify-center  text-[25px]`}
    >
      Nothing here yet
    </div>
  );
}

export function showInfoTip(
  tips: string,
  style: React.ReactNode = 'w-[190px]'
) {
  return (
    <Popover
      arrow={false}
      placement="bottom"
      color="#484848"
      content={
        <div
          className={clsx(
            'px-[15px] py-[10px] bg-[#484848] text-[white] text-[14px] rounded-[15px]',
            style
          )}
        >
          {tips}
        </div>
      }
    >
      <InfoCircleFilled className="align-text-top text-[10px] text-[#a9a9a9] " />
    </Popover>
  );
}

export function tagItemView(
  tag: any,
  callback?: Function,
  isSelected: boolean = true
) {
  return (
    <span
      className="  px-[10px] py-[5px]   text-[14px]  rounded-[16px]"
      style={{
        borderColor: tag.tagColor,
        color: tag.tagColor,
        background: colorConvert(
          tag.tagColor,
          isSelected ? CHECKED_BACKGROUND_OPACITY : NORMAL_BACKGROUND_OPACITY
        ),
        boxShadow: `2px 2px 3px 0px ${tag.tagColor}`,
      }}
      onClick={() => {
        if (callback) {
          callback();
        }
      }}
    >
      {tag.tag}
    </span>
  );
}
