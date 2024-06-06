import { Avatar, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateUserReq } from 'src/api/space';
import { ReactComponent as CloseIcon } from 'src/assets/media/svg/icon-close-button.svg';
import { ReactComponent as SmallEditIcon } from 'src/assets/media/svg/icon-small-edit.svg';
import { ReactComponent as UploadIcon } from 'src/assets/media/svg/icon-upload.svg';
import UploadImage from 'src/components/UploadImage';
import useUserInfo from 'src/data/use-user-info';
import { md5Pwd } from 'src/utils/common';

const General = ({ mutateData }: { mutateData?: () => void }) => {
  const { t } = useTranslation();
  const { data: userInfoDetail, mutate: mutateUserInfo } = useUserInfo();

  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  const [userNameOpen, setUserNameOpen] = useState(false); // title
  const [subTitleOpen, setSubTitle] = useState(false); // about
  const [addressOpen, setAddressOpen] = useState(false); // address
  const [password, setPassword] = useState(false); // password
  /** 回显 */
  useEffect(() => {
    if (userInfoDetail) {
      setData({
        userName: userInfoDetail.username || '',
        faceUrl: userInfoDetail?.faceUrl || '',
        coverUrl: userInfoDetail?.coverUrl || '',
        bio: userInfoDetail?.bio || '',
        walletAddress: userInfoDetail?.walletAddress || '',
        email: userInfoDetail?.email || '',
        newPsw: '',
      });
    }
  }, [userInfoDetail]);

  const handleChangeLogo = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess') + '!');
        setData({
          ...data,
          faceUrl: info.file.response.data,
        });
        onFinish({
          ...data,
          faceUrl: info.file.response.data,
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

      params.userName = params.userName.trim();
      params.faceUrl = params.faceUrl.trim();
      params.coverUrl = params.coverUrl.trim();
      params.bio = params.bio.trim();
      params.walletAddress = params.walletAddress.trim();
      params.email = params.email.trim();
      params.newPsw = params.newPsw.trim();

      setCommitLoading(true);
      const res = await updateUserReq(params, userInfoDetail?.namespace!);
      if (res.data.status) {
        message.success(t('clientUI.success') + '!');
        mutateUserInfo();
        if (mutateData) {
          mutateData();
        }
        setHide();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };

  const [data, setData] = useState({
    userName: '',
    faceUrl: '',
    coverUrl: '',
    bio: '',
    walletAddress: '',
    email: '',
    newPsw: '',
  });
  const delImg = () => {
    setData({
      ...data,
      coverUrl: '',
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
    if (type === 5) {
      setPassword(false);
    }
    if (!type) {
      setUserNameOpen(false);
      setSubTitle(false);
      setAddressOpen(false);
      setPassword(false);
    }
  };

  const option = (type: number) => {
    return (
      <div className="mt-[15px] flex justify-end items-center">
        <button
          className="button-white !justify-center  !text-[16px] px-[30px] py-[10px]"
          onClick={(e) => {
            setHide(type);
          }}
        >
          {t('clientUI.cancel')}
        </button>

        <div
          className="ml-[10px] cursor-pointer rounded-full bg-[#484848] text-[16px] font-[500] text-[#fff]"
          onClick={() => {
            onFinish();
          }}
        >
          <div className="px-[30px] py-[10px] w-[100px] flex justify-center items-center ">
            {commitLoading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            {t('clientUI.save')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-12 w-[100%] h-[100%] text-[16px]">
      <div className="py-[30px] border-b-[1px] border-[#e0e0e0]">
        <div className="flex items-center text-third font-[500]">
          {t('clientUI.personal.account.email')}
        </div>
        <div className="mt-[5px] text-[#231f20]">{data?.email}</div>
      </div>

      <div className="py-[30px] border-b-[1px] border-[#e0e0e0]">
        <div className="flex items-center text-third  font-[500]">
          {t('clientUI.personal.account.username')}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setUserNameOpen(true)}
          />
        </div>
        <div className="mt-[5px] text-[#231f20]">
          {userNameOpen ? (
            <Input
              autoFocus
              value={data?.userName}
              maxLength={14}
              className="input !rounded-[10px] !w-full"
              placeholder={t('clientUI.personal.account.userNameEnter')}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  userName: e.target.value.trim(),
                }))
              }
            />
          ) : (
            data?.userName || '-'
          )}
        </div>
        {userNameOpen && option(1)}
      </div>
      <div className="py-[30px] border-b-[1px] border-[#e0e0e0] text-[16px]">
        <div className="flex items-center text-third  font-[500]">
          {t('clientUI.personal.account.bio')}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setSubTitle(true)}
          />
        </div>
        <div className="mt-[5px] text-[#231f20]">
          {subTitleOpen ? (
            <Input.TextArea
              autoFocus
              value={data.bio}
              className="input !rounded-[10px] !w-full"
              placeholder={t('clientUI.personal.account.bioEnter')}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
            />
          ) : (
            data.bio || '-'
          )}
        </div>
        {subTitleOpen && option(2)}
      </div>
      <div className="py-[30px] border-b-[1px] border-[#e0e0e0] text-[16px]">
        <div className=" text-first  font-[500]">
          {t('clientUI.personal.account.userLogo')}
        </div>
        <div className="flex mt-[15px]  mb-[15px]">
          {data?.faceUrl && (
            <Avatar size={45} src={data?.faceUrl} className="mr-[10px]" />
          )}
          <div className="border-border  border hover:shadow-hover rounded-[40px]">
            <UploadImage
              maxWidth={300}
              cropShape={'round'}
              aspect={1}
              onChange={handleChangeLogo}
            >
              <div className="flex items-center h-[45px] rounded-[40px] px-5 cursor-pointer">
                <UploadIcon className="mr-5" />
                <div className="text-first">
                  {t('clientUI.spaceSetting.general.addLogo')}
                </div>
              </div>
            </UploadImage>
          </div>
        </div>
        <div className="text-[14px] font-[normal] text-first">
          We recommend an image of at least 300x300. Gifs work too. Max 5mb.
        </div>
      </div>
      <div className=" py-[30px] border-b-[1px] border-[#e0e0e0] text-[16px]">
        <div className="text-first   font-[500]">
          {t('clientUI.personal.account.bannerImage')}
        </div>
        <div
          className="mt-[25px] justify-center items-center flex w-full  relative bg-[#f3f3f3] rounded-[10px] overflow-hidden"
          style={{
            height: '196px',
          }}
        >
          {data?.coverUrl === '' ? (
            <div>
              <div className="border-border  border hover:shadow-hover rounded-[40px]">
                <UploadImage aspect={1080 / 230} onChange={handleChangeCover}>
                  <div className="flex items-center  h-[45px] rounded-[40px] px-5 cursor-pointer">
                    <UploadIcon className="mr-5" />
                    <div className="text-first">{t('clientUI.addFile')}</div>
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

      <div className="py-[30px] border-b-[1px] border-[#e0e0e0]">
        <div className="flex items-center text-third font-[500]">
          {t('clientUI.personal.account.password')}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setPassword(true)}
          />
        </div>
        <div className="text-[20px]  mt-[5px] w-full flex items-center">
          {password ? (
            <div className="flex items-center">
              <Input.Password
                autoComplete="new-password"
                className="input !rounded-[10px] !w-full"
                placeholder={t('clientUI.signup.passwordPlaceholder')}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    newPsw: md5Pwd(e.target.value.trim()),
                  }))
                }
              />
            </div>
          ) : (
            '******'
          )}
        </div>
        {password && option(5)}
      </div>
      <div className="py-[30px] border-b-[1px] border-[#e0e0e0]">
        <div className="flex items-center text-third  font-[500]">
          {t('clientUI.personal.account.walletAddress')}
          <SmallEditIcon
            className="ml-[5px] cursor-pointer"
            onClick={() => setAddressOpen(true)}
          />
        </div>
        <div className="mt-[5px] text-[#231f20]">
          {addressOpen ? (
            <Input
              autoFocus
              value={data?.walletAddress}
              maxLength={42}
              className="input !rounded-[10px] !w-full"
              placeholder={'Please input one Ethereum address'}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  walletAddress: e.target.value.trim(),
                }))
              }
            />
          ) : (
            data?.walletAddress || '-'
          )}
        </div>
        {addressOpen && option(3)}
      </div>
    </div>
  );
};
export default General;
