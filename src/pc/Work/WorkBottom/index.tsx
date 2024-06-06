import clsx from 'clsx';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';
import { ReactComponent as CommentIcon } from 'src/assets/media/svg2/icon-comment.svg';
import { ReactComponent as LikeIcon } from 'src/assets/media/svg2/icon-heart.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/icon-home-stream1.svg';
import { ReactComponent as ViewIcon } from 'src/assets/media/svg2/icon-view.svg';
import { ReactComponent as WorkBranchIcon } from 'src/assets/media/svg2/icon-work-branch.svg';
import CascadButton from 'src/components/CascadButton';

import { ReactComponent as PostArrowIcon } from 'src/assets/media/svg/icon-post-arrow.svg';
import { ReactComponent as ShareIcon } from 'src/assets/media/svg2/icon-share.svg';
import styles from './index.module.less';

import { Divider, Popover, message } from 'antd';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { clickLikeReq } from 'src/api/space/work';
import useUserInfo from 'src/data/use-user-info';
import { OpusInfo } from 'src/data/use-work-detail';
import { upstreamAtom } from 'src/recoil/branchUpstream';
import { publish } from 'src/utils/event';
import ShareView from '../ShareView';

interface ArticleProps {
  articleData?: OpusInfo;
  commentCount?: number;
}
const WorkBottom = (props: ArticleProps) => {
  const { articleData, commentCount = 0 } = props;
  const { t } = useTranslation();
  const [likeLoading, setLikeLoading] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false); // 是否是作者本人
  const [isLike, setIsLike] = useState(false); // 点赞
  const [likeCount, setLikeCount] = useState(0); // 点赞

  const [, setCreateUpstreamData] = useRecoilState(upstreamAtom);

  const { data: userInfo } = useUserInfo();

  /** 打赏 */
  const streamCreator = () => {
    if (!userInfo) {
      publish('showLoginView');
      return;
    }
    publish('open_work_streamModal');
  };

  useEffect(() => {
    if (articleData) {
      setIsLike(articleData?.isLike ?? false);
      setLikeCount(articleData?.likeCount ?? 0);
    }
  }, [articleData, articleData?.isLike]);

  useEffect(() => {
    if (articleData?.userInfo.id && userInfo?.id === articleData?.userInfo.id) {
      console.log('userInfo', userInfo, articleData?.userInfo.id);
      setIsAuthor(true);
    }
  }, [articleData, userInfo]);

  const [shareOpen, setShareOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setShareOpen(newOpen);
  };
  /** 点赞 */
  const handleClickLike = async () => {
    if (!userInfo) {
      publish('showLoginView');
      return;
    }

    try {
      if (likeLoading || !articleData?.id) return;
      setLikeLoading(true);
      const res = await clickLikeReq(articleData?.id);
      if (res.data.status === 1) {
        message.success(t('clientUI.success'));
        let count = likeCount;
        setLikeCount(isLike ? --count : ++count);
        setIsLike(!isLike);
        // isLike: !item.isLike,
      }
      setLikeLoading(false);
    } catch (error) {
      setLikeLoading(false);
      message.error((error as Error).message);
    }
  };

  return (
    <div className="relative w-full  flex-col  my-[25px]">
      <div className={clsx('flex justify-center ')}>
        <div className="relative">
          <div className="flex mt-[20px]  gap-[15px] py-[30px]">
            <CascadButton
              title={t('clientUI.postDetailInfo.branchIt')}
              icon={
                <WorkBranchIcon className="h-[30px] w-[30px]"></WorkBranchIcon>
              }
              color="#f23a00"
              type="filled"
              titleClassName="text-[18px] "
              onClick={() => {
                if (!userInfo) {
                  publish('showLoginView');
                  return;
                }
                setCreateUpstreamData({
                  ratio: 0.1,
                  upstreamOpusId: articleData!.id,
                  title: articleData!.title,
                });
                window.open(`/create?&cburl=${router.asPath}`);
                // publish('open_work_createOpusModal');
              }}
            ></CascadButton>
            {!isAuthor && (
              <CascadButton
                title={t('clientUI.postDetailInfo.supportToCreator')}
                iconClassName="w-[30px] !h-[30px] bg-[white] rounded-[50px]"
                icon={<StreamIcon></StreamIcon>}
                color="#2191FB"
                type="filled"
                titleClassName="text-[18px]"
                onClick={streamCreator}
              ></CascadButton>
            )}
          </div>
        </div>
      </div>
      <Divider className="bg-[#e0e0e0] !my-[15px]"></Divider>
      <div className={'flex items-center justify-between mx-[6px]'}>
        <div className="flex items-center">
          <div className="flex items-center">
            <ViewIcon className="text-first" />
            <span className={`text-[#696969] ml-[10px]`}>
              {articleData?.readCount}
            </span>
          </div>
          <div className="ml-[18px] cursor-pointer group flex items-center">
            <a href="#comment" className="flex items-center">
              <CommentIcon className="transition duration-300 " />
            </a>
            <span className={`text-[#696969] ml-[10px] group-hover:text-first`}>
              {commentCount}
            </span>
          </div>
        </div>

        <div className="flex items-center " id="shareView">
          <Popover
            placement="bottom"
            trigger={['click']}
            content={
              <ShareView
                handleHideCallback={() => setShareOpen(false)}
                title={articleData?.title ?? ''}
              />
            }
            getPopupContainer={() =>
              document.querySelector('#shareView') as HTMLElement
            }
            open={shareOpen}
            onOpenChange={handleOpenChange}
            overlayClassName={styles.popover}
          >
            <div className=" flex items-center cursor-pointer ">
              <ShareIcon className="text-first " />
              <span className={`text-[#696969] ml-[10px]`}>
                {articleData?.shareCount}
              </span>
            </div>
          </Popover>

          <div className="ml-[18px] cursor-pointer flex items-center">
            <div className="flex items-center">
              {isLike ? (
                <LikedIcon
                  className={`cursor-pointer text-btn-pink`}
                  onClick={handleClickLike}
                />
              ) : (
                <LikeIcon
                  className={`cursor-pointer`}
                  onClick={handleClickLike}
                />
              )}
              <span className={`text-[#696969] ml-[10px]`}>{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      {articleData?.arId && (
        <div className="w-full text-left my-[35px] mt-[50px] bg-[#f3f3f3]   h-[90px] border-[#e0e0e0] rounded-[15px] border-[1px]">
          <div className="text-[16px] text-[#231f20] border-b-[1px] border-[#e0e0e0] h-[45px] flex items-center pl-[20px]">
            {t('clientUI.postDetailInfo.onChainTips')}{' '}
          </div>
          <div className="h-[45px] text-[14px] flex items-center pl-[20px] text-[#696969] font-[500]">
            {t('clientUI.postDetailInfo.onChainTx')}
            <PostArrowIcon className="mx-[10px]" />
            <div className="font-[400]">
              <a
                href={`https://arseed.web3infra.dev/${articleData?.arId}`}
                target="blank"
                rel="noopener"
                className="hover:link-underline break-all"
              >
                {articleData?.arId}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WorkBottom;
