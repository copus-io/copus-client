import { Input, Popover } from 'antd';
import styles from './index.module.less';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as WrittingSearchIcon } from 'src/assets/media/svg/icon-writting-search.svg';

import { debounce } from 'lodash';

import { useTranslation } from 'react-i18next';
import SearchResultView, { SearchUpstreamParams } from './SearchResultView';

const Search = (props: SearchUpstreamParams) => {
  const { t } = useTranslation();
  const { onAddItem, existIds, uuid } = props;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<any>(null);

  /** 防抖 */
  const debounceChange = useMemo(() => {
    const loadOptions = (e: any) => {
      if (!e.target.value) {
        setValue('');
      }
      setValue(e.target.value);
      setOpen(true);
    };
    return debounce(loadOptions, 800);
  }, []);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popoverDiv = document.getElementById('popoverDiv');
      if (
        divRef.current &&
        !divRef.current.contains(event.target as Node) &&
        !popoverDiv?.contains(event.target as Node)
      ) {
        // 点击发生在div之外
        setOpen(false);
      }
    };

    // 添加全局点击监听
    document.addEventListener('mousedown', handleClickOutside);

    // 清理函数，在组件卸载时移除监听
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={divRef}>
      <div>
        <Popover
          // getPopupContainer={() =>
          //   document.querySelector('.cascade_con') as HTMLElement
          // }
          id="popoverDiv"
          open={open}
          // defaultOpen={true}
          overlayClassName={styles.popover}
          content={
            <div ref={popoverRef}>
              <SearchResultView
                keyword={value}
                existIds={existIds}
                uuid={uuid}
                onAddItem={(item) => {
                  setOpen(false);
                  if (onAddItem) {
                    onAddItem(item);
                  }
                }}
              ></SearchResultView>
            </div>
          }
          trigger={['click']}
          placement="bottom"
          onOpenChange={(e) => {
            console.log('onOpenChange', e);
          }}
        >
          <Input
            className={styles.input}
            placeholder={t('clientUI.search')}
            // value={value}
            onChange={(e) => {
              e.stopPropagation();
              debounceChange(e);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            onClick={(e) => {}}
            prefix={<WrittingSearchIcon />}
          />
        </Popover>
      </div>
    </div>
  );
};
export default Search;
