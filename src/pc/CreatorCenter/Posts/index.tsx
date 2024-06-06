import { ReactComponent as CommentIcon } from 'src/assets/media/svg2/icon-comment.svg';
import { ReactComponent as LikeIcon } from 'src/assets/media/svg2/icon-heart.svg';
import { ReactComponent as BranchIcon } from 'src/assets/media/svg2/icon-home-branch1.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as ViewIcon } from 'src/assets/media/svg2/icon-home-view1.svg';
import { ReactComponent as ShareIcon } from 'src/assets/media/svg2/icon-share.svg';
import { floorFixedNumber } from 'src/utils/common';
import styles from './index.module.less';

import clsx from 'clsx';
import { NextRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Search from 'src/components/Search';
import { postCover } from 'src/components/common';
import DraftList from './DraftList';
import PublishedList from './PublishedList';
import SubmissionList from './SubmissionList';

export default function Posts() {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const tags = [
    { title: t('clientUI.creatorCenter.published'), id: 10 },
    { title: t('clientUI.creatorCenter.submission'), id: 0 },
    { title: t('clientUI.creatorCenter.draft'), id: 20 },
  ];

  const [selectTagIndex, setSelectTagIndex] = useState(0);

  return (
    <div className="flex flex-col flex-1 w-full ">
      <div className="flex w-full justify-between  !my-[30px]">
        <div className="flex items-center text-[16px] text-[#a9a9a9]">
          {tags.map((item, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  'mr-[10px]',
                  index === selectTagIndex ? 'text-first' : ''
                )}
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
        <div>
          <Search
            searchClassName="!border-x-[1px] !border-none !h-[42px]  !rounded-[100px] !pl-[10px]"
            style={{
              backgroundColor: 'rgba(var(--bg-twelfth), 0.4)',
            }}
            isDebounce={true}
            onChange={onKeywordChange}
          ></Search>
        </div>
      </div>
      <div className="mb-[60px] h-[calc(100vh-350px)]">{list()}</div>
    </div>
  );

  function onKeywordChange(keyword: string) {
    setKeyword(keyword);
  }

  function list() {
    if (selectTagIndex === 0) {
      return <PublishedList keyword={keyword}></PublishedList>;
    }
    if (selectTagIndex === 1) {
      return <SubmissionList keyword={keyword} isFirst={true}></SubmissionList>;
    }
    if (selectTagIndex === 2) {
      return <DraftList keyword={keyword} isFirst={true}></DraftList>;
    }
  }
}

export function postInfoForListItem(
  outlineStyle: string,
  item: any,
  router: NextRouter
) {
  return (
    <div
      onClick={() => {
        router.push(`/work/${item.uuid}`);
      }}
      className={outlineStyle}
    >
      {postCover(item.coverUrl, item.title, 70, 'text-[50px]')}
      <div className="ml-[12px]">
        <div className="flex  items-center w-full mb-[10px]">
          <span className="text-[20px] line-clamp-1 text-left font-medium text-[#231f20]">
            {item?.title}
          </span>
        </div>
        <div className="flex  items-center mt-[2px] text-[14px] text-[#696969]">
          <div className="rounded-full  flex items-center justify-center mr-[4px]">
            <StreamIcon style={{ width: '15x', height: '17px' }} />
          </div>
          <span className="text-[14px] text-[#696969]   ml-[4px]">
            {floorFixedNumber(item?.rewardAmount || 0, 2)}
          </span>
          <div className="w-[10px]"></div>

          <div className="rounded-full flex items-center justify-center mr-[4px] ">
            <BranchIcon
              style={{
                width: '16px',
                height: '16px',
              }}
            />
          </div>
          <span className="text-[14px] text-[#696969]   ml-[4px]">
            {item?.shareCount || 0}
          </span>
          <div className="w-[10px]"></div>

          <div className=" flex items-center justify-center mr-[4px]">
            <ViewIcon style={{ width: '20px', height: '14px' }} />
          </div>
          <span className=" ml-[4px]">
            {floorFixedNumber(item?.readCount || 0, 0)}
          </span>
          <div className="w-[10px]"></div>

          <div className=" flex items-center justify-center mr-[4px]">
            <CommentIcon style={{ width: '16px', height: '14px' }} />
          </div>
          <span className=" ml-[4px]">{item?.commentCount || 0}</span>
          <div className=" w-[10px]"></div>
          <div className=" flex items-center justify-center mr-[4px]">
            <LikeIcon style={{ width: '16px', height: '14px' }} />
            <span className={`text-[#696969] ml-[10px]`}>
              {item?.likeCount}
            </span>
          </div>
          <div className=" w-[10px]"></div>
          <div className=" flex items-center justify-center mr-[4px]">
            <ShareIcon style={{ width: '16px', height: '16px' }} />
            <span className={`ml-[4px]`}>{item?.shareCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
