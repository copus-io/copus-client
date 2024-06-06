import { Avatar, Form, Input, message } from 'antd';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addOrUpdateUserLinkReq } from 'src/api/space/piece';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import UploadImage from 'src/components/UploadImage';
import type { SpaceExternalLinkInfo } from 'src/data/use-space-external-link-list';
import useRouterParams from 'src/hooks/use-router-params';
import { presetLinkImag } from '../../static';

interface AddLinkModalProps {
  open?: boolean;
  handleCancelCallback: (isRequest: boolean) => void;
  editData?: SpaceExternalLinkInfo;
}

const AddLinkModal = (props: AddLinkModalProps) => {
  const { t } = useTranslation();
  const { userId } = useRouterParams();
  const { open, handleCancelCallback, editData } = props;

  const [form] = Form.useForm();

  const [iconUrl, setIconUrl] = useState(''); // logo
  const [commitLoading, setCommitLoading] = useState(false); // logo

  /** 回显 */
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
      setIconUrl(editData.iconUrl);
    }
  }, [editData, form]);

  /** 新增编辑 */
  const onFinish = async (values: any) => {
    try {
      if (commitLoading) return;
      setCommitLoading(true);
      const params = {
        ...values,
        iconUrl,
      };
      if (editData) params.id = editData.id;
      const res = await addOrUpdateUserLinkReq(params, userId);
      if (res.data.status) {
        message.success(t('clientUI.success'));
        onCancel(true);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };

  /** 关闭 */
  const onCancel = (isRequest: boolean) => {
    handleCancelCallback(isRequest);
    form.resetFields();
    setIconUrl('');
  };
  const cancel = () => {
    onCancel(false);
  };
  /** upload cascad log */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess'));
        setIconUrl(info.file.response.data);
      } else {
        message.error(info.file.response.msg);
      }
    }
  };
  return (
    <div>
      {open && (
        <div className=" p-[20px] border-[1px] mt-[30px]">
          <Form onFinish={onFinish} autoComplete="off" form={form}>
            <div>
              {editData ? (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Avatar size={40} src={iconUrl} />
                  </div>
                  <div className="flex ml-3 items-center hover:shadow-hover">
                    <UploadImage
                      width={200}
                      cropShape={'round'}
                      height={200}
                      aspect={1}
                      onChange={handleChange}
                    >
                      <div className="underline text-first cursor-pointer">
                        {t('clientUI.spaceSetting.externalLinks.changeImage')}
                      </div>
                    </UploadImage>
                  </div>
                </div>
              ) : (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {presetLinkImag.map((item) => (
                      <div
                        onClick={() => setIconUrl(item.link)}
                        className={`cursor-pointer duration-300 flex items-center mr-[15px] ${
                          iconUrl === item.link ? 'opacity-100' : 'opacity-40'
                        }`}
                        key={item.link}
                      >
                        {item.icon}
                      </div>
                    ))}
                  </div>
                  <div className="flex ml-3 items-center">
                    {iconUrl &&
                      !presetLinkImag.find((item) => item.link === iconUrl) && (
                        <Avatar size={35} src={iconUrl} className="!mr-6" />
                      )}
                    <div className="border-border hover:shadow-hover border rounded-[40px]">
                      <UploadImage
                        cropShape={'round'}
                        aspect={1}
                        onChange={handleChange}
                      >
                        <div className="flex  items-center h-[40px] rounded-[40px] px-5 cursor-pointer">
                          <UploadIcon className="mr-5 " />
                          <div className="text-first">
                            {t('clientUI.spaceSetting.externalLinks.addImg')}
                          </div>
                        </div>
                      </UploadImage>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-second mb-3 mt-5">
              {t('clientUI.spaceSetting.externalLinks.title')}
            </div>
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input
                className="input !w-[100%]"
                placeholder={t(
                  'clientUI.spaceSetting.externalLinks.titleEnter'
                )}
              />
            </Form.Item>
            <div className="text-second mb-3 mt-5">
              {t('clientUI.spaceSetting.externalLinks.URL')}
            </div>
            <Form.Item
              name="link"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && !value.includes('http')) {
                      return Promise.reject(
                        new Error(
                          t('clientUI.spaceSetting.externalLinks.urlTips')
                        )
                      );
                    }
                    if (value.length > 255) {
                      return Promise.reject(
                        new Error(
                          t('clientUI.spaceSetting.externalLinks.urlLengthTips')
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                className="input !w-[100%]"
                placeholder={t('clientUI.spaceSetting.externalLinks.URLEnter')}
              />
            </Form.Item>
          </Form>
          <div className="pt-4 flex">
            <button className="button-green !h-[48px]" onClick={form.submit}>
              {commitLoading && (
                <span className="mr-2">
                  <i className="fa fa-circle-o-notch fa-spin " />
                </span>
              )}
              {editData
                ? t('clientUI.saveChanges')
                : t('clientUI.spaceSetting.externalLinks.create')}
            </button>
            <button
              className="!h-[48px] button-white ml-[20px] !px-[20px]"
              onClick={cancel}
            >
              {t('clientUI.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default memo(AddLinkModal);
