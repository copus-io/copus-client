import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateOpusContext from 'src/context/create-opus-context';
import CreateText from './CreateText';
import PublishModal from './PublishModal';

import type { CreateOpusReqParams, UpstreamOpus } from 'src/api/createOpus';
import { ReactComponent as LogoIcon } from 'src/assets/media/svg2/ic-copus.svg';
import { ReactComponent as DraftIcon } from 'src/assets/media/svg2/icon-draft.svg';

import { Spin } from 'antd';
import Link from 'next/link';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { useOpusDraftDetailReq } from 'src/data/use-work-detail';
import useRouterParams from 'src/hooks/use-router-params';
import { upstreamAtom } from 'src/recoil/branchUpstream';
import { publishDraftUUID } from 'src/recoil/publishDraftUUID';
import { autoSaveStateAtom, publishAtom } from 'src/recoil/publishOpus';

const Create = () => {
  const { t } = useTranslation();

  const { spaceId } = useRouterParams();
  const type = 0;
  const uuid = router.query.uuid as string;

  const [draftUUID, setPublishDraftUUID] = useRecoilState(publishDraftUUID);

  const [selectIndex, setSelectIndex] = useState(0);
  const [renderComplete, setRenderComplete] = useState<any>(false); // 富文本内容
  const [spinning, setSpinning] = useState(false);

  const setPublishRecoil = useSetRecoilState(publishAtom); // recoil
  const resetAutoSaveStateAtom = useResetRecoilState(autoSaveStateAtom); // recoil

  const autoSaveState = useRecoilValue(autoSaveStateAtom); // recoil
  const upstream = useRecoilValue(upstreamAtom); // recoil

  /** 接口-文章详情 */
  const {
    data: editData,
    isLoading,
    mutate,
  } = useOpusDraftDetailReq(uuid ?? draftUUID);

  useEffect(() => {
    if (!editData) {
      setSpinning(false);
    }
  }, [isLoading]);

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      // 同样，这里只能设置returnValue作为提示信息
      // e.preventDefault();
      console.log('beforeunload');
      setPublishDraftUUID('');
      resetAutoSaveStateAtom();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 清理函数，移除事件监听器
    return () => {
      setPublishDraftUUID('');
      resetAutoSaveStateAtom();
    };
  }, []);

  const [typeQuery, setTypeQuery] = useState(0);

  const [opusType, setOpusType] = useState(10);

  const [opusData, setOpusData] = useState<CreateOpusReqParams>({
    accessLevel: 0,
    content: '',
    coverUrl: '',
    emails: [],
    opusType: opusType,
    readers: [],
    storeOnChain: true,
    subTitle: '',
    title: '',
    upstreamList: [],
    uuid: uuid ?? draftUUID,
  });

  useEffect(() => {
    if (uuid) {
      setSpinning(!renderComplete);
    }
  }, [renderComplete]);

  const parentRef = useRef<HTMLDivElement>(null);

  const [openPublishModal, setOpenPublishModal] = useState(false);
  const [isFromBranch, setIsFromBranch] = useState(false);

  const handleCancelCallback = () => {
    setOpenPublishModal(false);
  };

  useEffect(() => {
    if (upstream) {
      console.log('UpstreamOpus', upstream);
      setIsFromBranch(true);
      setOpusData((data) => ({
        ...data,
        upstreamList: [upstream as UpstreamOpus],
      }));
    }
  }, [upstream]);

  useEffect(() => {
    if (editData) {
      const upstreamList: UpstreamOpus[] = editData.upstreamOpusList.map(
        (item) => {
          return {
            ...item,
            ratio: item.ratio ? item.ratio : 0.1,
            upstreamOpusId: item.id!,
            title: item.title,
          };
        }
      );
      console.log('editData', editData, upstreamList);
      setOpusData({
        accessLevel: 0,
        content: editData.content ?? '',
        coverUrl: editData.coverUrl,
        emails: [],
        opusType: editData.opusType,
        readers: [],
        storeOnChain: true,
        subTitle: editData.subTitle,
        title: editData.title,
        upstreamList: upstreamList,
        uuid: editData.uuid,
      });
    }
  }, [editData]);

  return (
    <CreateOpusContext.Provider
      value={{ data: opusData, setData: setOpusData }}
    >
      <div className="relative h-full flex select-none justify-center">
        <div
          ref={parentRef}
          className="flex flex-col w-[1440px]  overflow-hidden relative"
        >
          <div className="relative flex h-[71px] w-full items-end justify-between ">
            <Link className="relative" href={'/'}>
              <LogoIcon />
            </Link>

            {/* next */}
            <div className="relative flex justify-center items-center  ">
              <div className="mr-[40px]  text-[16px] text-[#696969]">
                {/* Draft saved */}
                {autoSaveState !== 0 && (
                  <div className="text-first flex">
                    {autoSaveState === 1 && (
                      <span className="mr-2">
                        <i className="fa fa-circle-o-notch fa-spin " />
                      </span>
                    )}
                    {autoSaveState === 1
                      ? t('clientUI.saving')
                      : autoSaveState === 2
                      ? t('clientUI.saved')
                      : t('clientUI.unsaved')}
                    <DraftIcon className="w-[23px] h-[23px] ml-[15px]"></DraftIcon>
                  </div>
                )}
              </div>
              <div
                className=" rounded-[15px] cursor-pointer bg-[#f23a00] h-[40px] p-[8px_20px] text-[16px] text-[#fff]"
                onClick={() => {
                  setPublishRecoil(true);
                  if (
                    opusData.title.length > 0 &&
                    opusData.content.length > 176
                  ) {
                    setOpenPublishModal(true);
                  }
                }}
              >
                Next
              </div>
            </div>
          </div>

          <div className="flex-1 w-full overflow-hidden  ">
            <Spin size="large" spinning={spinning}>
              <div className="h-full ">
                {/* {items[selectIndex] && <div>{items[selectIndex].view}</div>} */}
                <CreateText
                  opusInfo={editData}
                  isEdit={!!uuid} // 通过 url 的 uuid 判断是否是编辑状态
                  onRender={(isCom) => {
                    setRenderComplete(isCom);
                  }}
                  onTypeChange={(type) => {
                    setOpusType(type);
                  }}
                ></CreateText>
              </div>
            </Spin>
          </div>
          <PublishModal
            open={openPublishModal}
            spaceId={spaceId}
            isFromBranch={isFromBranch}
            handleCancelCallback={handleCancelCallback}
          ></PublishModal>
        </div>
      </div>
    </CreateOpusContext.Provider>
  );
};
export default Create;
