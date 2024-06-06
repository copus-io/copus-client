import { message, Select } from 'antd';
import type { SelectProps } from 'antd/es/select';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WrittingSearchIcon } from 'src/assets/media/svg/icon-writting-search.svg';
import styles from './index.module.less';

const { Option } = Select;

export interface Options {
  key?: number;
  label: string | JSX.Element;
  checkedValue: string;
  value?: string;
}
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: any;
  debounceTimeout?: number;
}

/** 远程搜索，防抖控制 */
const DebounceSelect = ({
  fetchOptions,
  debounceTimeout = 400,
  className,
  ...props
}: DebounceSelectProps) => {
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(false);

  const [options, setOptions] = useState<Options[]>([]);
  const fetchRef = useRef(0);
  /** 防抖 */
  const debounceFetcher = useMemo(() => {
    setOptions([]);
    setFetching(true);

    const loadOptions = async (value: string) => {
      try {
        fetchRef.current += 1;
        const newOptions = await fetchOptions(value);
        setOptions(newOptions);
        setFetching(false);
      } catch (error: any) {
        setFetching(false);
        message.error((error as Error).message);
      }
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions]);

  useEffect(() => {
    debounceFetcher('');
  }, [debounceFetcher]);

  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      suffixIcon={<WrittingSearchIcon />}
      className={clsx(styles.select, 'w-full')}
      getPopupContainer={() =>
        document.querySelector('.cascade_con') as HTMLElement
      }
      allowClear
      popupClassName={clsx(styles.dropdown, className)}
      notFoundContent={
        options.length === 0 ? (
          fetching ? (
            <div className="flex justify-center items-center text-first">
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
              {t('clientUI.loading')}
            </div>
          ) : (
            <div className="flex justify-center h-[120px] items-center text-first">
              {t('clientUI.startCreating.read')}
            </div>
          )
        ) : null
      }
      {...props}
      optionLabelProp="checkedValue"
    >
      {options.map((item) => (
        <Option
          key={item.value}
          checkedValue={item.checkedValue}
          value={item.value}
        >
          {item.label}
        </Option>
      ))}
    </Select>
  );
};
export default memo(DebounceSelect);
