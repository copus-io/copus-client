import { Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowIcon } from 'src/assets/media/svg2/ic-arrow.svg';
import { spaceLogo } from 'src/components/common';
import type { SpaceSimpleInfo } from 'src/data/use-author-cascade-list';
import useAuthorCascadeListReq from 'src/data/use-author-cascade-list';
import { getStringLength } from 'src/utils/common';
import styles from './index.module.less';

const initShowCount = 6;

const Space = () => {
  const { t } = useTranslation();
  const { data } = useAuthorCascadeListReq();

  const cascadeList = data ? ([] as SpaceSimpleInfo[]).concat(...data) : [];
  let noShowNum = cascadeList.length - initShowCount;

  const [showMore, setShowMore] = useState(false);

  return (
    <div className={styles.scrollbarSource}>
      <p className="font-[600]">{t('clientUI.spaces')}</p>

      <div className="flex flex-col pl-[10px]  pb-[20px]">
        {cascadeList.map((item, index) => {
          if (!showMore) {
            if (index >= initShowCount) return;
          }
          return (
            <div
              className="flex items-center rounded-[15px] cursor-pointer"
              key={index}
            >
              <Link
                href={`/${item.namespace}`}
                className="flex items-center mt-[18px]"
              >
                {spaceLogo(item.logoUrl, item.title, 20, 'text-[10px]')}

                {getStringLength(item.title) > 12 ? (
                  <Tooltip title={item.title} color="#F23A00">
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100px',
                      }}
                      className="font-[14px] text-[#231f20] ml-[15px]"
                    >
                      {item.title}
                    </span>
                  </Tooltip>
                ) : (
                  <span className="font-[14px] text-[#231f20] ml-[15px]">
                    {item.title}
                  </span>
                )}
              </Link>
            </div>
          );
        })}

        {noShowNum > 0 && (
          <div
            onClick={() => {
              setShowMore(!showMore);
            }}
            className="cursor-pointer "
          >
            {!showMore && (
              <div className="mt-[18px]">
                <ArrowIcon className="mr-[15px] " />{' '}
                <span>
                  {t('clientUI.home.show')} {noShowNum}{' '}
                  {t('clientUI.home.more')}
                </span>
              </div>
            )}
            {showMore && (
              <div className="mt-[18px]">
                <ArrowIcon
                  className="mr-[15px] "
                  style={{
                    transform: 'rotateZ(180deg)',
                  }}
                />
                <span>
                  {t('clientUI.home.show')} {t('clientUI.home.less')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Space;
