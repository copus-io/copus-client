import clsx from 'clsx';
import { ReactComponent as EditIcon } from 'src/assets/media/svg2/icon-edit.svg';
import CascadButton from 'src/components/CascadButton';

import { t } from 'i18next';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { userFace } from 'src/components/common';
import useUserInfo from 'src/data/use-user-info';
import { OpusInfo } from 'src/data/use-work-detail';
import { formatTimestamp, isHtmlorJson } from 'src/utils/common';
const LexicalComponent = dynamic(() => import('src/components/Lexical'), {
  ssr: false,
});
interface ArticleProps {
  articleData?: OpusInfo;
}
const Article = (props: ArticleProps) => {
  const { articleData } = props;
  const [isAuthor, setIsAuthor] = useState(false); // 是否是作者本人
  const { data: userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo?.id === articleData?.userInfo.id) {
      setIsAuthor(true);
    }
  }, [articleData?.userInfo.id, userInfo]);
  const [contentType, setContentType] = useState(0); // 作品类型

  useEffect(() => {
    if (articleData?.content) {
      const type = isHtmlorJson(articleData?.content);
      setContentType(type);
    }
  }, [articleData?.content]);
  return (
    <div className={clsx(' !w-full flex relative mt-[80px] ')}>
      <div className="w-full">
        {/* title */}
        <div className="flex w-full justify-between items-center h-[48px]">
          <div className="text-[38px]  color-[#231f20] font-[500] line-clamp-1">
            {articleData?.title}
          </div>
          {isAuthor && (
            <CascadButton
              color="#484848"
              title={t('clientUI.postDetailInfo.edit')}
              icon={<EditIcon></EditIcon>}
              iconClassName="h-[20px] w-[16px]"
              titleClassName=" text-[16px] font-normal ml-[10px] leading-5"
              onClick={() => {
                router.push(
                  `/create?uuid=${articleData?.uuid}&cburl=${router.asPath}`
                );
              }}
            ></CascadButton>
          )}
        </div>
        {/* Author */}
        <div className="flex relative items-center w-full text-[#231f20] text-[16px]  mt-[20px]">
          {userFace(articleData?.userInfo?.faceUrl, 'w-[20px] h-[20px]')}
          <span
            className="ml-[10px] cursor-pointer hover:underline font-[500]"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/user/${articleData?.userInfo.namespace}`);
            }}
          >
            {articleData?.userInfo?.username}
          </span>
          <span className="mx-[10px]">•</span>

          {articleData?.publishTime && (
            <div>{formatTimestamp(articleData.publishTime as any)}</div>
          )}
        </div>
        {/* content */}
        <div className="mt-[25px]">
          {contentType === 1 ? (
            <div className="flex my-[20px] ">
              <LexicalComponent
                readOnly={true}
                initialValue={articleData?.content ?? ''}
                key={articleData?.publishTime}
              />
            </div>
          ) : contentType === 2 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: articleData?.content ?? '',
              }}
              onClick={(e) => {
                const ele = e.target as HTMLElement;
                if (ele instanceof HTMLImageElement) {
                  console.log('123', e.target, e.target instanceof String);
                }
                // console.log('123', e.target.parentElement?.attributes.href.value);
                // e.preventDefault();
                // e.stopPropagation();
              }}
            ></div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
export default Article;
