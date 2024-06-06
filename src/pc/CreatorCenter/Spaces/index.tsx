import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Search from 'src/components/Search';
import InviteSpaces from './InviteSpaces';
import JoinedSpaces from './JoinedSpaces';
import MyCreatedSpaces from './MyCreatedSpaces';
import styles from './index.module.less';

export default function Spaces() {
  const { t } = useTranslation();
  const tagNames = [
    { title: t('clientUI.creatorCenter.mySpaces'), id: 0 },
    { title: t('clientUI.creatorCenter.joinedSpaces'), id: 10 },
    { title: t('clientUI.creatorCenter.invitationSpace'), id: 20 },
  ];
  const [selectTagIndex, setSelectTagIndex] = useState(0);

  const [keyword, setKeyword] = useState('');
  function onKeywordChange(keyword: string) {
    setKeyword(keyword);
  }

  return (
    <div className="flex flex-col flex-1 w-full ">
      <div className="flex w-full justify-between  !my-[30px]">
        <div className="flex items-center text-[16px] text-[#a9a9a9]">
          {tagNames.map((item, index) => {
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
        {selectTagIndex < 2 ? (
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
        ) : (
          <div className="w-[250px] h-[40px]"></div>
        )}
      </div>
      <div className="mb-[20px] h-[calc(100vh-300px)]">{list()}</div>
    </div>
  );

  function list() {
    if (selectTagIndex === 0) {
      return (
        <MyCreatedSpaces keyword={keyword} isFirst={true}></MyCreatedSpaces>
      );
    }

    if (selectTagIndex === 1) {
      return <JoinedSpaces keyword={keyword} isFirst={true}></JoinedSpaces>;
    }

    return <InviteSpaces keyword={keyword} isFirst={true}></InviteSpaces>;
  }
}
