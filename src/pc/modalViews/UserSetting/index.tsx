import type { RadioChangeEvent } from 'antd';
import { Radio, Space, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLangReq } from 'src/api/space';
import { logoutReq } from 'src/api/user';
import useUserInfo from 'src/data/use-user-info';
import useRouterParams from 'src/hooks/use-router-params';
import useUserInfo1 from 'src/hooks/use-user-info';
import { TOKEN } from 'src/utils/statics';
import ExternalLinks from './ExternalLinks';
import General from './General';

function LogoutView() {
  const { mutate: mutateUserInfo } = useUserInfo();
  const { t } = useTranslation();
  const [commitLoading, setCommitLoading] = useState(false);
  const router = useRouter();
  return (
    <div>
      <div className="text-[20px] font-[600]">
        {t('clientUI.personal.logout.title')}
      </div>
      <div
        className="mt-[30px] cursor-pointer"
        onClick={async () => {
          if (commitLoading) return;
          setCommitLoading(true);
          try {
            const res = await logoutReq();
            if (res.data.data) {
              mutateUserInfo();
              localStorage.removeItem(TOKEN);
              router.push('/');
              message.success('logout success');
            }
          } catch (error) {
            message.error((error as Error).message);
          }
          setCommitLoading(false);
        }}
      >
        <div className="border rounded-full px-[20px] py-[10px] flex items-center justify-center w-[140px] hover:bg-[#eee]">
          {commitLoading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          {t('clientUI.personal.logout.btnLogout')}
        </div>
      </div>
    </div>
  );
}

function ChangeLanguage() {
  const { data: userInfo, mutate: mutateUserInfo } = useUserInfo1();
  const { userId } = useRouterParams();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<number>(0);
  useEffect(() => {
    if (userInfo) {
      setLanguage(userInfo.languageType || 0);
    }
  }, [userInfo]);
  const onChange = async (e: RadioChangeEvent) => {
    setLanguage(e.target.value);
    try {
      const params = {
        languageType: e.target.value,
      };
      const res = await changeLangReq(params, userId);
      if (res.data.status) {
        message.success(t('clientUI.success'));
        let lang = 'en';
        if (e.target.value === 10) {
          lang = 'zh';
        }
        localStorage.setItem('lang', lang);
        i18n.changeLanguage(lang);
        mutateUserInfo();
      }
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  return (
    <div className="">
      <Radio.Group onChange={onChange} value={language}>
        <Space direction="vertical">
          <Radio value={0}>English</Radio>
          <Radio value={10}>简体中文</Radio>
        </Space>
      </Radio.Group>
    </div>
  );
}
const UserSetting = ({ mutateData }: { mutateData?: () => void }) => {
  const [checkValue, setCheckValue] = useState('0');

  async function onClickMenuItem(item: { value: string; label: string }) {
    setCheckValue(item.value);
  }
  const { t } = useTranslation();
  let leftMenu = [
    {
      value: '0',
      label: t('clientUI.personal.account.name'),
      component: <General mutateData={mutateData} />,
    },
    {
      value: '1',
      label: t('clientUI.spaceSetting.externalLinks.name'),
      component: <ExternalLinks />,
    },
    {
      value: '3',
      label: t('clientUI.language'),
      component: <ChangeLanguage />,
    },
    {
      value: '2',
      label: t('clientUI.personal.logout.name'),
      component: <LogoutView />,
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
                onClickMenuItem(item);
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 pt-[30px] pl-[30px] pr-[12px] h-[100%] overflow-y-auto overflow-x-hidden">
        {leftMenu.find((item) => checkValue === item.value)?.component}
      </div>
    </div>
  );
};
export default UserSetting;
