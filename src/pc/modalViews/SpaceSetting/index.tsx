import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Custom from './Custom';
import ExternalLinks from './ExternalLinks';
import General from './General';
import Members from './Members';
import TagSetting from './TagSetting';

const SpaceSetting = ({ spaceId }: { spaceId: string }) => {
  const { t } = useTranslation();
  const [checkValue, setCheckValue] = useState('0');
  /** 左侧菜单 */
  const leftMenu = [
    {
      value: '0',
      label: t('clientUI.spaceSetting.general.name'),
      component: <General spaceId={spaceId} />,
    },
    {
      value: '1',
      label: t('clientUI.spaceSetting.users.name'),
      component: <Members spaceId={spaceId} />,
    },
    {
      value: '2',
      label: t('clientUI.spaceSetting.tagSetting.name'),
      component: <TagSetting spaceId={spaceId} />,
    },
    {
      value: '3',
      label: t('clientUI.spaceSetting.externalLinks.name'),
      component: <ExternalLinks spaceId={spaceId} />,
    },
    {
      value: '4',
      label: t('clientUI.spaceSetting.custom.name'),
      component: <Custom spaceId={spaceId} />,
    },
  ];

  /** 权限判断 */
  return (
    <div
      className="flex h-full pt-[10px] "
      style={{ height: 'calc(100vh - 250px)' }}
    >
      <div className="w-[130px]  overflow-y-auto ml-[30px] mr-[20px]">
        {leftMenu.map((item, index) => (
          <div
            key={item.value}
            className={`py-[22px] text-[#231f20] border-b-[1px] border-borderThirdColor text-[16px] ${
              checkValue === item.value ? 'font-medium' : 'font-normal'
            } `}
          >
            <span
              className="cursor-pointer"
              onClick={() => {
                setCheckValue(item.value);
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1  pt-[30px] pl-[30px] pr-[12px] h-[100%] overflow-y-auto overflow-x-hidden">
        {leftMenu.find((item) => checkValue === item.value)?.component}
      </div>
    </div>
  );
};
export default SpaceSetting;
