import { Select, SelectProps, Spin, message } from 'antd';
import { debounce } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { getUserListByKeyword } from 'src/api/user';
import { workInviteReaders } from 'src/api/work';
import { OpusInfoForPublished } from 'src/data/use-user-creator-center-published-list';
import UserSimpleInfo from 'src/data/user-simpleInfo-model';
import { validateEmail } from 'src/utils/common';

// https://ant.design/components/select-cn
// https://app.zeplin.io/project/65dfeff4065151651326d684/screen/65f60fb374af2fc763905809

interface WorkSharePrivateProps {
  close?: () => void;
  dataCallBack?: (emails: string[], userIds: number[]) => void;
  opus?: OpusInfoForPublished;
}

export default function WorkSharePrivate(props: WorkSharePrivateProps) {
  const { opus, close, dataCallBack } = props;

  const [value, setValue] = useState<UserValue[]>([]);
  const [loading, setLoading] = useState(false);

  async function onShare() {
    if (loading) return;
    setLoading(true);

    let array = value as UserValue[];
    let emailList: Array<string> = [];
    let idList: Array<number> = [];
    if (array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.label === undefined) {
          if (validateEmail(element.value)) {
            emailList.push(element.value);
          }
        } else {
          idList.push(element.key!);
        }
      }
    }
    try {
      if (emailList.length > 0 || idList.length > 0) {
        if (opus) {
          const res = await workInviteReaders({
            opusId: opus.id!,
            emails: emailList,
            readers: idList,
          });

          if (res.data.status === 1) {
            message.info('invite finish');
          }
        }

        if (dataCallBack) {
          dataCallBack(emailList, idList);
        }
      }
    } catch {
      message.error('invite error');
    }
    setLoading(false);
  }

  return (
    <div className="p-[20px] pt-[20px]">
      <div className="text-[25px]">Share privately for {opus?.title}</div>
      <div className="pb-[30px]">
        <div className="mb-[10px] text-[red] text-[16px]">
          Please write valid user name or email address.
        </div>
        <DebounceSelect
          mode="tags"
          value={value}
          placeholder="Select users or enter the user email"
          fetchOptions={fetchUserList}
          onChange={(newValue) => {
            let values = newValue as UserValue[];

            let newArr: UserValue[] = [];
            values.forEach((item: UserValue) => {
              if (item.key === undefined) {
                if (validateEmail(item.value)) {
                  newArr.push(item);
                }
              } else {
                newArr.push(item);
              }
            });
            setValue(newArr);
          }}
          style={{ width: '100%' }}
        />
      </div>

      <div className="flex gap-[30px] justify-end items-center">
        <div onClick={close} className="cursor-pointer ">
          Cancel
        </div>
        <div
          onClick={onShare}
          className="px-[30px] py-[15px] bg-gray-900 rounded-[50px] text-white text-[20ox] cursor-pointer hover:shadow-hover "
        >
          Share
          {loading && (
            <span className="ml-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface UserValue {
  key?: number;
  label: string;
  value: string;
  disabled: boolean;
}

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<ValueType extends UserValue = any>({
  fetchOptions,
  debounceTimeout = 350,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      size="large"
      maxTagTextLength={30}
      onSearch={debounceFetcher}
      onSelect={(e) => {
        if (e.label === undefined) {
          if (!validateEmail(e.value)) {
            message.error('Wrong email address');
          }
        }
      }}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

async function fetchUserList(keyword: string): Promise<UserValue[]> {
  let retArr: UserValue[] = [];
  if (keyword.length > 2) {
    let res = await getUserListByKeyword({ keyword: keyword });
    if (res.data.status === 1) {
      let array = res.data.data;
      if (array.length > 0) {
        for (let index = 0; index < array.length; index++) {
          const element = array[index] as unknown as UserSimpleInfo;
          retArr.push({
            label: element.username,
            value: element.username,
            key: element.id,
            disabled: false,
          });
        }
      }
    }
  }
  return retArr;
}
