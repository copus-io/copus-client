import type { RadioChangeEvent } from 'antd';
import { Avatar, Input, Radio, Space, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateSpaceReq } from 'src/api/space';
import { ReactComponent as CloseIcon } from 'src/assets/media/svg/icon-close-button.svg';
import { ReactComponent as PostArrowIcon } from 'src/assets/media/svg/icon-post-arrow.svg';
import { ReactComponent as SmallEditIcon } from 'src/assets/media/svg/icon-small-edit.svg';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import UploadImage from 'src/components/UploadImage';
import { showInfoTip } from 'src/components/common';
import useSpaceDetailReq from 'src/data/use-space-detail';

const General = ({ spaceId }: { spaceId: string }) => {
  const { t } = useTranslation();
  const router = useRouter();

  /** hook-空间详情 */
  const { data: spaceDetail, mutate: spaceMutate } = useSpaceDetailReq(spaceId);

  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  const [userNameOpen, setUserNameOpen] = useState(false); // title
  const [subTitleOpen, setSubTitle] = useState(false); // about
  const [addressOpen, setAddressOpen] = useState(false); // address
  const [rateOpen, setRateOpen] = useState(false); // space tax rate

  const [data, setData] = useState({
    title: '',
    logoUrl: '',
    coverUrl: '',
    subTitle: '',
    treasuryAddress: '',
    taxRatio: 0,
    accessLevel: 0,
  });

  /** 回显 */
  useEffect(() => {
    if (spaceDetail) {
      setData({
        title: spaceDetail.title || '',
        logoUrl: spaceDetail?.space?.logoUrl || '',
        coverUrl: spaceDetail.coverUrl || '',
        subTitle: spaceDetail.subTitle || '',
        treasuryAddress: spaceDetail.space?.treasuryAddress || '',
        taxRatio: spaceDetail?.space?.taxRatio || 0,
        accessLevel: spaceDetail?.accessLevel || 0,
      });
    }
  }, [spaceDetail]);

  const handleChangeLogo = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess') + '!');
        setData({
          ...data,
          logoUrl: info.file.response.data,
        });
        onFinish({
          ...data,
          logoUrl: info.file.response.data,
        });
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  const handleChangeCover = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess') + '!');
        setData({
          ...data,
          coverUrl: info.file.response.data,
        });
        onFinish({
          ...data,
          coverUrl: info.file.response.data,
        });
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  /** 提交 */
  const onFinish = async (params?: any) => {
    try {
      if (!params) {
        params = data;
      }

      setCommitLoading(true);
      const res = await updateSpaceReq(params, spaceId);
      if (res.data.status) {
        message.success(t('clientUI.success') + '!');
        spaceMutate();
        setHide();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };

  const delImg = () => {
    setData({
      ...data,
      coverUrl: '',
    });
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setData({
      ...data,
      accessLevel: e.target.value,
    });
    onFinish({
      ...data,
      accessLevel: e.target.value,
    });
  };

  const setHide = (type?: number) => {
    if (type === 1) {
      setUserNameOpen(false);
    }
    if (type === 2) {
      setSubTitle(false);
    }
    if (type === 3) {
      setAddressOpen(false);
    }
    if (type === 4) {
      setRateOpen(false);
    }
    if (!type) {
      setUserNameOpen(false);
      setSubTitle(false);
      setAddressOpen(false);
      setRateOpen(false);
    }
  };

  const option = (type: number) => {
    return (
      <div className="mt-[15px] flex justify-end">
        <button
          className="button-white !justify-center !h-[42px] !text-[16px]  "
          onClick={(e) => {
            setHide(type);
          }}
        >
          {t('clientUI.cancel')}
        </button>
        <button
          className="button-green ml-5 !px-[25px] !h-[42px]"
          onClick={() => {
            onFinish();
          }}
        >
          {commitLoading && (
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
          )}
          {t('clientUI.save')}
        </button>
      </div>
    );
  };

  return (
    <div className="pb-12  mr-[50px] ">
      <div className="py-[30px] border-b-[1px]  border-[#e0e0e0]">
        <div className="flex font-[500] items-center text-third">
          {t('clientUI.spaceSetting.general.spaceName')}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setUserNameOpen(true)}
          />
        </div>
        <div className="text-[20px] mt-[5px] flex items-center">
          {userNameOpen ? (
            <Input
              autoFocus
              value={data?.title}
              maxLength={14}
              className="input !rounded-[10px] !w-full"
              placeholder={t('clientUI.personal.account.userNameEnter')}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          ) : (
            data?.title || '-'
          )}
        </div>
        {userNameOpen && option(1)}
      </div>
      <div className="py-[30px] border-b-[1px]  border-[#e0e0e0]">
        <div className="flex font-[500] items-center text-third">
          {t('clientUI.spaceSetting.general.about')}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setSubTitle(true)}
          />
        </div>
        <div className="text-[20px] mt-[5px]">
          {subTitleOpen ? (
            <Input.TextArea
              autoFocus
              value={data.subTitle}
              maxLength={160}
              className="input !rounded-[10px] !w-full"
              placeholder={t('clientUI.personal.account.bioEnter')}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  subTitle: e.target.value,
                }))
              }
            />
          ) : (
            data.subTitle || '-'
          )}
        </div>
        {subTitleOpen && option(2)}
      </div>
      <div className="py-[30px] border-b-[1px] border-[#e0e0e0]">
        <div className=" text-first text-[16px] font-[500]">
          {t('clientUI.spaceSetting.general.spaceLogo')}
        </div>
        <div className="flex mt-[15px] mb-[15px] gap-[15px]">
          {data?.logoUrl && (
            <Avatar
              size={45}
              src={data?.logoUrl}
              className="rounded-full object-cover object-center"
            />
          )}
          <div className="border-border border hover:shadow-hover rounded-[40px]">
            <UploadImage
              cropShape={'round'}
              aspect={1}
              onChange={handleChangeLogo}
            >
              <div className="flex items-center h-[45px] rounded-[40px] px-5 cursor-pointer">
                <UploadIcon className="mr-5" />
                <div className="font-[500] text-first">
                  {t('clientUI.spaceSetting.general.addLogo')}
                </div>
              </div>
            </UploadImage>
          </div>
        </div>
        <div className="text-[14px] font-[normal] text-first">
          {t('clientUI.spaceSetting.general.spaceLogoTips')}
        </div>
      </div>
      <div className=" py-[30px] border-b-[1px]  border-[#e0e0e0]">
        <div className=" text-first font-medium text-[16px]">
          {t('clientUI.spaceSetting.general.banner')}
        </div>
        <div className="mt-[25px] justify-center items-center flex w-full h-[164px] relative bg-[#f3f3f3] rounded-[10px] overflow-hidden">
          {data?.coverUrl === '' ? (
            <div>
              <div className="border-border  border hover:shadow-hover rounded-[40px]">
                <UploadImage
                  isCrop={true}
                  aspect={1080 / 230}
                  onChange={handleChangeCover}
                >
                  <div className="flex items-center  h-[45px] rounded-[40px] px-5 cursor-pointer">
                    <UploadIcon className="mr-5" />
                    <div className="text-first font-[16px]">
                      {t('clientUI.addFile')}
                    </div>
                  </div>
                </UploadImage>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <img
                className="w-full h-full "
                src={data?.coverUrl}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
              <CloseIcon
                onClick={delImg}
                className="absolute cursor-pointer w-[12px] h-[12px] right-[10px] top-[10px] text-first"
              ></CloseIcon>
            </div>
          )}
        </div>
      </div>
      <div className=" py-[30px] border-b-[1px]  border-[#e0e0e0]">
        <div className="flex items-center text-third font-[500]">
          {t('clientUI.spaceSetting.general.access')}
        </div>
        <div className="mt-[15px]">
          <Radio.Group onChange={onChange} value={data.accessLevel}>
            <Space direction="vertical">
              <Radio value={0}>
                {t('clientUI.spaceSetting.general.access1')}
              </Radio>
              <Radio value={10}>
                {t('clientUI.spaceSetting.general.access2')}
              </Radio>
              <Radio value={20}>
                {t('clientUI.spaceSetting.general.access3')}
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </div>
      <div className="py-[30px] border-b-[1px]  border-[#e0e0e0]">
        <div className="flex items-center text-third font-[500] gap-[2px]">
          {t('clientUI.spaceSetting.general.treasuryAddress')}
          {showInfoTip(
            'A Web3 wallet address for collecting Space Tax.',
            'w-[200px]'
          )}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setAddressOpen(true)}
          />
        </div>
        <div className="text-[20px] mt-[5px] flex items-center">
          {addressOpen ? (
            <Input
              autoFocus
              value={data?.treasuryAddress}
              maxLength={42}
              className="input !rounded-[10px] !w-full"
              placeholder={t(
                'clientUI.spaceSetting.general.treasuryAddressTips'
              )}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  treasuryAddress: e.target.value.trim(),
                }))
              }
            />
          ) : (
            data?.treasuryAddress || '-'
          )}
        </div>
        {addressOpen && option(3)}
      </div>
      <div className="py-[30px] border-b-[1px]  border-[#e0e0e0]">
        <div className="flex items-center text-third font-[500] gap-[2px]">
          {t('clientUI.spaceSetting.general.taxRate')}
          {showInfoTip(
            t('clientUI.spaceSetting.general.taxRateTips'),
            'w-[250px]'
          )}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setRateOpen(true)}
          />
        </div>
        <div className="text-[20px]  mt-[5px] flex items-center">
          {rateOpen ? (
            <div className="flex items-center w-[78px]">
              <Input
                autoFocus
                value={data?.taxRatio * 100}
                maxLength={14}
                style={{
                  width: '100px !important',
                }}
                className="input !rounded-[10px] !w-[100px]"
                placeholder={t('clientUI.personal.account.userNameEnter')}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    taxRatio: Number(e.target.value),
                  }))
                }
              />
              <span className="ml-[10px]">%</span>
            </div>
          ) : (
            <div>{data?.taxRatio * 100}%</div>
          )}
        </div>
        {rateOpen && option(4)}
      </div>
      <div className="py-[10px]">
        {spaceDetail?.arIdUrl && (
          <div className="w-full text-left mt-[35px] bg-second bg-opacity-5 text-[14px]  h-[105px] border-border rounded-[20px] border-[1px]">
            <div className="text-first border-b-[1px] border-border h-10 flex items-center pl-[30px]">
              {t('clientUI.spaceSetting.general.storedTips')}
            </div>
            <div className="text-first mt-[10px] flex items-center pl-[30px]">
              {t('clientUI.spaceSetting.general.ARWEAVE')}
              <PostArrowIcon className="ml-2" />
            </div>
            <div className="pl-[30px] mt-1">
              <a
                href={spaceDetail.arIdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-first break-all"
              >
                {spaceDetail?.arId}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default General;
