import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { addOrEditCommentReq } from 'src/api/work';
import type { OpusCommentInfo } from 'src/data/use-work-comment-list';
import useCommetListReq from 'src/data/use-work-comment-list';
import useUserInfo from 'src/hooks/use-user-info';
import CommentItem from './CommentItem';
import styles from './index.module.less';

import { useTranslation } from 'react-i18next';
import UserAvatar from 'src/components/UserAvatar';
import { OpusInfo } from 'src/data/use-work-detail';

interface CommentProps {
  opusInfo: OpusInfo;
  addOrSubCommentCount: (count: number) => void;
}

export type CommentListItem = OpusCommentInfo & {
  isTop: boolean;
  parIndex: number;
  childIndex?: number;
};

const Comment = (props: CommentProps) => {
  const { t } = useTranslation();
  const { opusInfo, addOrSubCommentCount } = props;
  const router = useRouter();
  const { data: userInfo } = useUserInfo();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentId, setCommentId] = useState<number>(undefined!);
  const [endId, setEndId] = useState<number>(undefined!);
  const [commetList, setCommentList] = useState<OpusCommentInfo[]>([]);
  const [rows, setRows] = useState(3);
  const [topShowMore, setTopShowMore] = useState(false); // 删除一级评论后是否还有更多

  /** interface-comment list */
  const { data, isValidating } = useCommetListReq({
    opusUuid: opusInfo.uuid,
    endId,
    rows,
    commentId,
  });

  /** 设置分页数据 */
  useEffect(() => {
    if (data) {
      // 子评论
      if (commentId) {
        setCommentList((list) =>
          list.map((item) =>
            item.id === commentId
              ? {
                  ...item,
                  children:
                    item.children.length > 0
                      ? [...item.children, ...data.data]
                      : data.data,
                }
              : item
          )
        );
      } else {
        setCommentList((list) => (endId ? [...list, ...data.data] : data.data));
        setTopShowMore(!!data.data[0]?.isMore);
      }
    }
  }, [commentId, data, endId]);

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
          // router.push(`/login?cburl=${encodeURIComponent(router.asPath)}`);
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
      const { data } = await addOrEditCommentReq({
        opusId: opusInfo.id,
        content: comment.trim(),
      });
      if (data.status) {
        message.success(t('clientUI.success'));
        setComment('');
        setCommentList((list) => [
          {
            ...data.data,
            userFaceUrl: userInfo?.faceUrl || '',
            username: userInfo?.username || '',
            children: [],
          },
          ...list,
        ]);
        addOrSubCommentCount(1);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error((error as Error).message);
    }
  };

  /** 设置二级评论 */
  const setCommentChildren = useCallback(
    (commentId: number, data: OpusCommentInfo, parIndex: number) => {
      const comment = {
        ...data,
        userFaceUrl: userInfo?.faceUrl || '',
        username: userInfo?.username || '',
      };

      setCommentList((list) =>
        list.map((item, index) =>
          index === parIndex
            ? {
                ...item,
                commentCount: ++item.commentCount,
                children:
                  item.children.length > 0
                    ? [comment, ...item.children]
                    : [comment],
              }
            : item
        )
      );
      addOrSubCommentCount(1);
    },
    [addOrSubCommentCount, userInfo?.faceUrl, userInfo?.username]
  );

  /** 编辑评论 */
  const editComment = useCallback((data: CommentListItem) => {
    if (data.isTop) {
      console.log(data);

      setCommentList((list) =>
        list.map((item, index) => (index === data.parIndex ? data : item))
      );
    } else {
      setCommentList((list) =>
        list.map((item, index) =>
          index === data.parIndex
            ? {
                ...item,
                children: item.children.map((inner: any, innerIndex: number) =>
                  innerIndex === data.childIndex ? data : inner
                ),
              }
            : item
        )
      );
    }
  }, []);

  /** 删除评论 */
  const delComment = useCallback(
    (data: CommentListItem) => {
      if (data.isTop) {
        setCommentList((list) =>
          list.filter((item, index) => index !== data.parIndex)
        );
      } else {
        setCommentList((list) =>
          list.map((item, index) =>
            index === data.parIndex
              ? {
                  ...item,
                  commentCount: --item.commentCount,
                  children: item.children.filter(
                    (item: any, innerIndex: number) =>
                      innerIndex !== data.childIndex
                  ),
                }
              : item
          )
        );
      }
      addOrSubCommentCount(
        data.children.length > 0 ? -(data.children.length + 1) : -1
      );
    },
    [addOrSubCommentCount]
  );

  /** 评论点赞 */
  const commentClickLike = useCallback((data: CommentListItem) => {
    if (data.isTop) {
      setCommentList((list) =>
        list.map((item, index) =>
          index === data.parIndex
            ? {
                ...item,
                isLike: !item.isLike,
                likeCount: item.isLike ? --item.likeCount : ++item.likeCount,
              }
            : item
        )
      );
    } else {
      setCommentList((list) =>
        list.map((item, index) =>
          index === data.parIndex
            ? {
                ...item,
                children: item.children.map((item: any, innerIndex: any) =>
                  innerIndex === data.childIndex
                    ? {
                        ...item,
                        isLike: !item.isLike ? 0 : 1,
                        likeCount: item.isLike
                          ? --item.likeCount
                          : ++item.likeCount,
                      }
                    : item
                ),
              }
            : item
        )
      );
    }
  }, []);

  return (
    <div className="my-[20px]" id="comment">
      <div
        className={clsx('text-[#231f20]', styles.commentTitle)}
        id="comments"
      >
        {t('clientUI.postDetailInfo.comments')}
      </div>
      <div className="my-[25px] w-full flex">
        <div className="!flex-shrink-0">
          {/* <Avatar size={35} icon={<UserOutlined />} src={userInfo?.faceUrl} /> */}
          <UserAvatar
            isSeedao={userInfo?.seeDaoName ? true : false}
            logoUrl={userInfo?.faceUrl}
            size={40}
          />
        </div>
        <div className={clsx('flex-1 relative ml-[20px]')}>
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
            <div className={styles.sendBtn} onClick={handleSend}>
              {loading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin" />
                </span>
              )}
              {t('clientUI.postDetailInfo.comments')}
            </div>
          </div>
        </div>
      </div>
      <div>
        {commetList.map((item, index) => (
          <div key={item.id}>
            <div className={styles.commentItem}>
              <CommentItem
                detail={{ ...item, isTop: true, parIndex: index }}
                delComment={delComment}
                editComment={editComment}
                commentClickLike={commentClickLike}
                setCommentChildren={setCommentChildren}
              />
            </div>
            <div className={styles.replyComment}>
              {item.children?.map((inner: CommentListItem, innerIndex: any) => (
                <div className={styles.subComment} key={inner.id}>
                  <CommentItem
                    detail={{
                      ...inner,
                      isTop: false,
                      parIndex: index,
                      childIndex: innerIndex,
                    }}
                    delComment={delComment}
                    editComment={editComment}
                    commentClickLike={commentClickLike}
                    setCommentChildren={setCommentChildren}
                  />
                </div>
              ))}
              {item.commentCount > 0 &&
                item.children.length < item.commentCount && (
                  <div
                    className={styles.replyShowMore}
                    onClick={() => {
                      if (
                        item.children &&
                        item.children.length > 0 &&
                        item.children.length < item.commentCount
                      ) {
                        setEndId(item.children[item.children.length - 1].id);
                      } else {
                        setEndId(undefined!);
                      }
                      setRows(5);
                      setCommentId(item.id);
                    }}
                  >
                    {isValidating && commentId === item.id ? (
                      <>
                        <i className="fa fa-circle-o-notch fa-spin mr-1" />
                        {t('clientUI.loading')}
                      </>
                    ) : (
                      'View more comments'
                    )}
                  </div>
                )}
            </div>
            <div
              className={clsx(
                'border-t-[1px] border-border-base',
                styles.commentDivider
              )}
            />
          </div>
        ))}
        {topShowMore && (
          <div
            className={styles.commentShowMore}
            onClick={() => {
              setCommentId(undefined!);
              setRows(5);
              setEndId(
                commetList.length > 0
                  ? commetList[commetList.length - 1].id
                  : undefined!
              );
            }}
          >
            {isValidating && !commentId ? (
              <>
                <i className="fa fa-circle-o-notch fa-spin mr-1" />
                {t('clientUI.loading')}
              </>
            ) : (
              t('clientUI.postDetailInfo.loadMoreComment')
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(Comment);
