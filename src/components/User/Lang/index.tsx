import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface LangListProps {
  handleHideCallback: (value: any) => void;
}

const LangList = (props: LangListProps) => {
  const { i18n } = useTranslation();
  const { handleHideCallback } = props;
  const [value, setValue] = useState('en');
  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'en';
    setValue(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);
  const onChange = (value: string | any) => {
    setValue(value);
    localStorage.setItem('lang', value);
    i18n.changeLanguage(value);
    handleHideCallback(value);
  };

  const List = [
    {
      id: 1,
      value: 'en',
      name: 'En',
      label: 'English',
    },
    {
      id: 2,
      value: 'zh',
      name: '中',
      label: 'Chinese',
    },
  ];

  return (
    <div className="text-first">
      <div className="w-[146px] h-auto ">
        {List.map((item) => (
          <div
            key={item.id}
            onClick={() => onChange(item.value)}
            className="h-[50px] cursor-pointer text-[#231f20] text-[14px] flex items-center"
            style={
              value === item.value
                ? {
                    background: 'rgba(228, 224, 224, 0.4)',
                  }
                : {}
            }
          >
            <div
              className="w-[25px]  ml-[20px] rounded-[50%] font-[500] mr-[32px] text-[10px] h-[25px] bg-[#e4e0e0] flex justify-center items-center"
              style={
                value === item.value
                  ? {
                      background: '#393939',
                      color: '#fff',
                    }
                  : {}
              }
            >
              {item.name}
            </div>
            <div className="">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default memo(LangList);
