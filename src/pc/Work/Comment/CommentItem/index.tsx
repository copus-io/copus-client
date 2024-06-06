import { ExclamationCircleFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Modal, Popconfirm, message } from 'antd';
import clsx from 'clsx';
import styles from '../index.module.less';
// import Link from 'next/link';
import { ReactComponent as CommentIcon } from 'src/assets/media/svg2/icon-comment.svg';
// import { ReactComponent as LikeIcon } from 'src/assets/media/svg/icon-like.svg';
import { ReactComponent as LikedIcon } from 'src/assets/media/svg/icon-liked.svg';
import { ReactComponent as LikeIcon } from 'src/assets/media/svg2/icon-heart.svg';

import { Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import {
  addOrEditCommentReq,
  commentClickLikeReq,
  delCommentReq,
} from 'src/api/work';
import UserAvatar from 'src/components/UserAvatar';
import type { OpusCommentInfo } from 'src/data/use-work-comment-list';
import useUserInfo from 'src/hooks/use-user-info';
import { themeObj } from 'src/recoil/theme';
import { formatTimestamp } from 'src/utils/common';
import type { CommentListItem } from '..';

const { Paragraph } = Typography;

interface CommentItemProps {
  detail: CommentListItem;
  delComment: (data: CommentListItem) => void;
  editComment: (data: CommentListItem) => void;
  commentClickLike: (data: CommentListItem) => void;
  setCommentChildren: (
    commentId: number,
    data: OpusCommentInfo,
    parIndex: number
  ) => void;
}

const CommentItem = (props: CommentItemProps) => {
  const { t } = useTranslation();
  const {
    detail,
    delComment,
    editComment,
    commentClickLike,
    setCommentChildren,
  } = props;
  const { data: userInfo } = useUserInfo();
  const router = useRouter();

  const [likeLoading, setLikeLoading] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [ellipsis, setEllipsis] = useState(true);

  /** recoil */
  const themeRecoil = useRecoilValue(themeObj);

  /** onchange */
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!userInfo) {
      Modal.confirm({
        title: t('clientUI.joinCopus'),
        icon: <ExclamationCircleFilled />,
        centered: true,
        okText: t('clientUI.yes'),
        cancelText: t('clientUI.no'),
        onOk() {
          router.push(`/login?cburl=${encodeURIComponent(router.asPath)}`);
        },
      });
      return;
    } else {
      setComment(e.target.value);
    }
  };

  /** 评论 */
  const handleSend = async () => {
    try {
      if (!comment.trim()) {
        message.info(t('clientUI.postDetailInfo.commentNotice'));
        return;
      }
      setLoading(true);
      const params: any = {
        articleId: detail.articleId,
        content: comment.trim(),
      };
      if (edit) {
        params.id = detail.id;
      } else {
        params.targetCommentId = detail.id;
      }
      const { data } = await addOrEditCommentReq(params);
      if (data.status) {
        message.success(t('clientUI.success'));
        setComment('');
        if (edit) {
          editComment({ ...detail, content: comment.trim() });
        } else {
          setCommentChildren(detail.id, data.data, detail.parIndex);
        }
        setEdit(false);
        setInputOpen(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error((error as Error).message);
    }
  };

  /** 删除评论 */
  const handleDel = async () => {
    try {
      const res = await delCommentReq(detail.id);
      if (res.data.status === 1) {
        message.success(t('clientUI.success'));
        delComment(detail);
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  /** 点赞 */
  const handleClickLike = async () => {
    try {
      if (!userInfo) {
        Modal.confirm({
          title: t('clientUI.joinCopus'),
          icon: <ExclamationCircleFilled />,
          centered: true,
          okText: t('clientUI.yes'),
          cancelText: t('clientUI.no'),
          onOk() {
            router.push(`/login?cburl=${encodeURIComponent(router.asPath)}`);
          },
        });
        return;
      }
      if (likeLoading || !detail?.id) return;
      setLikeLoading(true);
      const res = await commentClickLikeReq(detail?.id);
      if (res.data.status === 1) {
        commentClickLike(detail);
      }
      setLikeLoading(false);
    } catch (error) {
      setLikeLoading(false);
      message.error((error as Error).message);
    }
  };

  const ele = useMemo(
    () => (
      <div className="relative" key={detail.id + dayjs().valueOf()}>
        <Paragraph
          ellipsis={
            ellipsis
              ? {
                  rows: 1,
                  expandable: true,
                  symbol: (
                    <span className="" onClick={() => setEllipsis(false)}>
                      {t('clientUI.viewMore')}
                    </span>
                  ),
                }
              : false
          }
          className="!text-first text-[16px] pt-[5px]"
          style={{
            width: '100%',
            whiteSpace: 'break-spaces',
          }}
        >
          {detail.content.split('\n').map((item, index) => (
            <Fragment key={index}>
              {index !== 0 && <br />}
              {item}
            </Fragment>
          ))}
        </Paragraph>
      </div>
    ),
    [detail.content, detail.id, ellipsis, t]
  );

  return (
    <>
      {!edit && (
        <div className="flex">
          <div className="!flex-shrink-0">
            <UserAvatar
              isSeedao={detail?.seeDaoName ? true : false}
              logoUrl={detail.userFaceUrl}
              size={35}
              faceSize={20}
            />
          </div>
          <div className={styles.commentContent}>
            <div
              className={clsx(
                'text-first overflow-hidden',
                styles.commentClassA
              )}
            >
              {detail.targetUsername && (
                <span className="text-first mr-1">
                  {t('clientUI.reply')}
                  <span className="ml-1 text-second/90">
                    {detail.targetUsername}
                  </span>
                  :
                </span>
              )}
              {ele}
              {!ellipsis && (
                <span
                  onClick={() => setEllipsis(true)}
                  className="cursor-pointer text-btn-save block"
                >
                  {t('clientUI.close')}
                </span>
              )}
            </div>
            <div
              className={clsx(
                `flex mt-3 ${
                  themeRecoil.theme === 'light'
                    ? 'text-second/90'
                    : 'text-first'
                }`,
                styles.commentInfo
              )}
            >
              <div className="flex items-center">
                <Link href={`/user/${detail.userInfo.namespace}`}>
                  <span className={styles.commentAuthor}>
                    {detail?.userInfo.username}
                  </span>
                </Link>
                {/* <div className="flex items-center ml-1">
                {detail?.badgeAuthor && (
                  <Tooltip title="Author">
                    <AuthorIcon />
                  </Tooltip>
                )}
                {detail?.badgeTree && (
                  <Tooltip title="Tree">
                    <TreeIcon className="ml-1" />
                  </Tooltip>
                )}
              </div> */}
                <span className={styles.dian}>•</span>
                <span> {formatTimestamp(detail.createTime, true)}</span>
              </div>
              <div
                className={clsx('flex items-center mt-[5px]', styles.editCon)}
              >
                <span
                  className="cursor-pointer h-full flex items-center"
                  onClick={() => setInputOpen(!inputOpen)}
                >
                  <CommentIcon className={styles.commentIcon} />
                  {detail.commentCount > 0 && (
                    <span className="mr-1">{detail.commentCount}</span>
                  )}
                  {t('clientUI.reply')}
                </span>
                {detail.userId === userInfo?.id && (
                  <>
                    <div className=" h-full flex items-center">
                      <span className={clsx(styles.dian)}>•</span>
                      <span
                        className="cursor-pointer"
                        onClick={() => {
                          setEdit(true);
                          setInputOpen(true);
                          setComment(detail.content);
                        }}
                      >
                        {t('clientUI.postDetailInfo.edit')}
                      </span>
                    </div>
                    <div className="text-btn-pink h-full flex items-center">
                      <span className={clsx('!text-btn-pink', styles.dian)}>
                        •
                      </span>
                      <Popconfirm
                        title="Are you sure to delete this comment?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={handleDel}
                      >
                        <span className="cursor-pointer">
                          {t('clientUI.delete')}
                        </span>
                      </Popconfirm>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div
            className={clsx('flex items-center justify-end', styles.likeWrap)}
          >
            {detail.isLike ? (
              <LikedIcon className="cursor-pointer" onClick={handleClickLike} />
            ) : (
              <LikeIcon className="cursor-pointer" onClick={handleClickLike} />
            )}
            <span className="text-second/90 ml-1">{detail.likeCount}</span>
          </div>
        </div>
      )}
      <div
        className={clsx(
          `overflow-hidden transition-height duration-700 mt-0 ${
            inputOpen ? '!mt-6' : 'h-0'
          } ${edit ? '!pl-0 !transition-none' : ''}`,
          styles.replyInputWrap,
          { [styles.inputOpen]: inputOpen }
        )}
      >
        <div className="!flex-shrink-0">
          <Avatar size={35} icon={<UserOutlined />} src={userInfo?.faceUrl} />
        </div>
        <div className={clsx('flex-1 relative', styles.replyInputBox)}>
          <TextArea
            value={comment}
            maxLength={40000}
            autoSize
            className={styles.input}
            style={{ resize: 'none', width: '100%' }}
            onChange={onChange}
            placeholder={t('clientUI.postDetailInfo.saySomeThing')}
          />
          <div className="absolute right-[10px] bottom-[15px] flex w-none">
            <div
              className={styles.cancelBtn}
              onClick={() => {
                setComment('');
                setEdit(false);
                setInputOpen(false);
              }}
            >
              {t('clientUI.cancel')}
            </div>
            <div className={styles.sendBtn} onClick={handleSend}>
              {loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin" />
                </span>
              )}
              {t('clientUI.reply')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(CommentItem);
