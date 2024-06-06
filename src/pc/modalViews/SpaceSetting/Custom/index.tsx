import { Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateSpaceNamespace } from 'src/api/space';
import { ReactComponent as IconCustomLink } from 'src/assets/media/svg/icon-custom-link.svg';

const Custom = ({ spaceId }: { spaceId: string }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [commitLoading, setCommitLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const { origin } = window.location;
  useEffect(() => {
    setName(spaceId);
    setDomain(origin);
  }, [spaceId, origin]);
  // 取消

  const cancel = () => {
    setName(spaceId);
  };
  // 发布
  const publish = async () => {
    try {
      setCommitLoading(true);
      const params = {
        name,
      };
      const res = await updateSpaceNamespace(params, spaceId);
      if (res.data.status) {
        router.push('/' + name);
        message.success(t('clientUI.success') + '!');
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  const [tag, setTag] = useState<any>();
  // copyLink 复制到粘贴板中
  const copyLink = () => {
    const input = document.createElement('input');
    input.value = domain + '/' + name;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    message.success(t('clientUI.copySuccess'));
    if (tag) {
      // 替换地址
      // tag.location.replace(name);
    } else {
      // let newTag = window.open(name, '_blank');
      // setTag(newTag);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^a-z0-9]/g, '');
    setName(value);
  };
  return (
    <>
      <div className="w-[100%]">
        <div className="text-first text-[20px]">
          {t('clientUI.spaceSetting.custom.title')}
        </div>
        <div className="text-first text-[16px] font-normal mt-[15px]">
          {t('clientUI.spaceSetting.custom.subTitle')}
        </div>
        <div className="text-first text-[16px] font-normal mt-[15px]">
          {t('clientUI.spaceSetting.custom.tips')}
        </div>
        <div className="flex items-center mt-[15px] flex-wrap">
          <div className="text-[14px] text-second opacity-[0.6]">{domain}/</div>
          <div className="w-[auto] ml-[5px] mr-[20px]">
            <Input
              className="input"
              value={name}
              onChange={onChange}
              maxLength={20}
              style={{ width: '100%', height: '38px' }}
            />
          </div>

          <div
            onClick={copyLink}
            className="text-third cursor-pointer text-[16px] underline ml-[5px]"
          >
            <IconCustomLink className="mr-[5px] text-third" />
            {t('clientUI.spaceSetting.custom.copyLink')}
          </div>
        </div>
        <div className="flex mt-[40px] mb-[20px] justify-end">
          <div
            onClick={cancel}
            className={
              'duration-300 cursor-pointer overflow-hidden px-[20px] border border-border rounded-[20px] h-[40px] flex items-center justify-center'
            }
          >
            <div className="flex items-center text-first ">
              {t('clientUI.cancel')}
            </div>
          </div>
          <button
            onClick={publish}
            className="button-green ml-5 !px-[25px] !h-[40px]"
          >
            {commitLoading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            {t('clientUI.save')}
          </button>
        </div>
      </div>
    </>
  );
};
export default Custom;
