import { Avatar, Form, Input, message } from 'antd';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import UploadImage from 'src/components/UploadImage';
import styles from '../index.module.less';
interface CreateFirstProps {
  step: number;
  logoUrl: string;
  coverUrl: string;
  cascadeName: string;
  changeStep: (step: number) => void;
  changeLogo: (step: string) => void;
  changeCoverUrl: (step: string) => void;
  close: () => void;
}

type ValidateStatus =
  | ''
  | 'success'
  | 'warning'
  | 'error'
  | 'validating'
  | undefined;

const CreateFirst = (props: CreateFirstProps) => {
  const { t } = useTranslation();
  const {
    step,
    logoUrl,
    coverUrl,
    cascadeName,
    changeStep,
    changeLogo,
    changeCoverUrl,
    close,
  } = props;

  const [validateNameStatus, setValidateNameStatus] =
    useState<ValidateStatus>('');

  /** upload cascad log */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess') + '!');
        changeLogo(info.file.response.data);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  const handleChangeLogo = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess') + '!');
        changeCoverUrl(info.file.response.data);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };
  return (
    <div
      className={`flex flex-col items-center text-first ${
        step === 1 ? '' : 'h-0 overflow-hidden'
      }`}
    >
      <div className="h-[440px]">
        <div className="text-[38px] text-center leading-[45px] font-medium mb-[10px]">
          {t('clientUI.createSpace.title')}
        </div>
        <div className="text-[20px] text-center mb-[45px]">
          {t('clientUI.createSpace.tips')}
        </div>
        <div>
          <Form.Item
            name="title"
            label={t('clientUI.createSpace.name')}
            className="!mb-[20px] formLabel"
            rules={[
              {
                required: true,
                message: t('clientUI.createSpace.nameMsg'),
              },
            ]}
            validateStatus={validateNameStatus}
            help={validateNameStatus && 'Please give it a name.'}
          >
            <Input
              className={clsx('input', styles.inputcon)}
              id="error"
              placeholder={t('clientUI.createSpace.nameEnter')}
            />
          </Form.Item>
          <div className="label">{t('clientUI.createSpace.logo')}</div>
          <div className="flex mb-4">
            <div className="border-second/60 hover:shadow-hover border rounded-[40px]">
              <UploadImage
                cropShape={'round'}
                aspect={1}
                onChange={handleChange}
              >
                <div className="flex items-center h-[45px] rounded-[40px] px-5 cursor-pointer">
                  <UploadIcon className="mr-5" />
                  <div>{t('clientUI.createSpace.addLogo')}</div>
                </div>
              </UploadImage>
            </div>
            {logoUrl && <Avatar size={48} src={logoUrl} className="!ml-6" />}
          </div>
          <div className="label">{t('clientUI.createSpace.background')}</div>
          <div className="flex mb-4">
            <div className="border-second/60 hover:shadow-hover border rounded-[40px]">
              <UploadImage aspect={192 / 108} onChange={handleChangeLogo}>
                <div className="flex items-center h-[45px] rounded-[40px] px-5 cursor-pointer">
                  <UploadIcon className="mr-5" />
                  <div>{t('clientUI.createSpace.addLogo')}</div>
                </div>
              </UploadImage>
            </div>
            {coverUrl && <Avatar size={48} src={coverUrl} className="!ml-6" />}
          </div>
        </div>
      </div>
      <div className={clsx('flex justify-end w-full mt-12', styles.bottomCon)}>
        <div
          className="button-cancel"
          onClick={(e) => {
            e.preventDefault();
            // router.back();
            close();
          }}
        >
          {t('clientUI.cancel')}
        </div>

        <button
          className="button-green ml-5"
          onClick={(e) => {
            e.preventDefault();
            if (!cascadeName) {
              setValidateNameStatus('error');
              return;
            }
            setValidateNameStatus('');
            changeStep(2);
          }}
        >
          {t('clientUI.continue')}
        </button>
      </div>
    </div>
  );
};
export default memo(CreateFirst);
