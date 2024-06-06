import { Input } from 'antd';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as SearchIcon } from 'src/assets/media/svg2/icon-search.svg';
import styles from './index.module.less';

interface SearchProps {
  searchClassName?: string;
  isDebounce?: boolean;
  onChange: (value: string) => void;
  style?: any;
  searchText?: string;
  pl?: string;
}

const Search = (props: SearchProps) => {
  const { t } = useTranslation();
  const {
    searchClassName = '',
    onChange,
    isDebounce = true,
    style,
    searchText = '',
    pl = t('clientUI.search'),
  } = props;

  const [value, setValue] = useState(searchText);

  /** 防抖 */
  const debounceChange = useMemo(() => {
    const loadOptions = (value: string) => {
      onChange(value);
    };
    return debounce(loadOptions, isDebounce ? 800 : 0);
  }, [isDebounce, onChange]);

  return (
    <div className="w-full ">
      <Input
        allowClear
        placeholder={pl}
        className={clsx(searchClassName, styles.search)}
        value={value}
        style={style}
        onChange={(e) => {
          setValue(e.target.value);
          debounceChange(e.target.value);
        }}
        prefix={
          <SearchIcon
            className="text-first pr-[2px]"
            // onClick={() => onChange(value)}
          />
        }

        // onPressEnter={(e: any) => onChange(e.target.value)}
      />
    </div>
  );
};
export default memo(Search);
