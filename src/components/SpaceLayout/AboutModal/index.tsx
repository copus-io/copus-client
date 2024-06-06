import { Input, message } from 'antd';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { updateSpaceReq } from 'src/api/space';
import ModalPro from 'src/components/ModalPro';
import useSpaceDetailReq from 'src/data/use-space-detail';
import useRouterParams from 'src/hooks/use-router-params';
import { themeObj } from 'src/recoil/theme';
import styles from './index.module.less';

interface AboutModalProps {
  open: boolean;
  data?: string;
  handleCancel: (isMutate?: boolean) => void;
}

const AboutModal = (props: AboutModalProps) => {
  const { t } = useTranslation();
  const { open, data, handleCancel } = props;
  const { spaceId } = useRouterParams();
  const { data: spaceDetail, mutate: spaceMutate } = useSpaceDetailReq(spaceId);

  const [commitLoading, setCommitLoading] = useState(false);
  const [value, setValue] = useState('');

  /** recoil */
  const themeRecoil = useRecoilValue(themeObj);

  /** 设置数据 */
  useEffect(() => {
    if (data) setValue(data);
  }, [data]);

  const commitAbout = async () => {
    try {
      if (value.length > 160) {
        message.warning('Maximum 160 characters');
        return;
      }
      setCommitLoading(true);
      const res = await updateSpaceReq(
        {
          subTitle: value,
        },
        spaceId
      );

      if (res.data.status) {
        message.success('Success!');
        handleCancel(true);
        spaceMutate();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  return (
    <ModalPro
      title={t('clientUI.spaceSetting.general.about')}
      open={open}
      onCancel={() => handleCancel(false)}
      footer={false}
      className={clsx({
        [styles.modal]: themeRecoil.theme === 'dark',
      })}
      getContainer={() =>
        document.getElementById(`cascade-${themeRecoil.theme}`) || document.body
      }
    >
      <Input.TextArea
        value={value}
        maxLength={160}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        rows={6}
        className="textArea !mt-[20px]"
      />
      <div className="flex text-[14px] justify-end  text-second/90">
        <span
          style={{
            color:
              value.length > 160
                ? 'rgba(var(--text-five),1)'
                : 'rgba(var(--text-second),0.9)',
          }}
        >
          {value.length}
        </span>
        /160
      </div>
      <div className="flex mt-4 justify-between">
        <span className="text-text-second/90 text-first">
          {t('clientUI.spaceSetting.general.aboutMaxCharacters')}
        </span>
        <button
          className="button-green !h-[40px] !px-[25px]"
          onClick={commitAbout}
        >
          {commitLoading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          {t('clientUI.save')}
        </button>
      </div>
    </ModalPro>
  );
};
export default memo(AboutModal);
