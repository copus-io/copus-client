import { useTranslation } from 'react-i18next';
import styles from './index.module.less';
// 首先确保已经安装了echarts和echarts-for-react库

import { Divider, Image, Radio, RadioChangeEvent, Switch, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import WorkSharePrivate from 'src/pc/modalViews/WorkSharePrivate';
import Search from './Search';
import SourceView from './SourceView';

// import ReactEcharts from 'echarts-for-react';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  OpusPublish,
  UpstreamOpus,
  publishOpusReq,
  saveDraftOpusReq,
} from 'src/api/createOpus';
import { CommonModal } from 'src/components/ModalPro';
import UploadImage from 'src/components/UploadImage';
import { OpusCardInfo } from 'src/data/use-insporedvo-list';
import useCreateData from 'src/hooks/use-create-data';
import { upstreamAtom } from 'src/recoil/branchUpstream';
import { publishDraftUUID } from 'src/recoil/publishDraftUUID';
import { autoSaveStateAtom } from 'src/recoil/publishOpus';
import Graph from './Graph';
const ReactEcharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
});
const Publish = (props: { spaceId?: string; isFromBranch: boolean }) => {
  const CBUrl = router.query.cburl as string;

  const { spaceId, isFromBranch } = props;
  const { t } = useTranslation();
  const [autoSaveState, setAutoSaveState] = useRecoilState(autoSaveStateAtom); // 自动保存loading

  // 定义饼图的数据和配置
  const [echartsOption, setEchartsOption] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const reqStateRef = useRef(false); // 判断是否正在进行请求
  const [upstream, setUpstream] = useRecoilState(upstreamAtom); // recoil

  const resetUpstreamAtom = useResetRecoilState(upstreamAtom);

  const [, setPublishDraftUUID] = useRecoilState(publishDraftUUID);
  const [openInviteNewReader, setOpenInviteNewReader] = useState(false);

  const [sourceDatas, setSourceDatas] = useState<OpusCardInfo[]>([]);

  const { data: opusData, setData: setOpusData } = useCreateData();

  const [coverUrl, setCoverUrl] = useState(opusData.coverUrl);
  const [isOnChain, setIsOnChain] = useState(opusData.storeOnChain);

  const onChangeRadio = (e: RadioChangeEvent) => {
    setOpusData((data) => ({ ...data, accessLevel: e.target.value }));
    e.preventDefault();
  };

  const sharePrivateHandle = (emails: string[], userIds: number[]) => {
    setOpusData((data) => ({
      ...data,
      emails: emails,
      readers: userIds,
    }));
  };

  const [existIds, setExistIds] = useState('');
  const [ratioSum, setRatioSum] = useState(0);

  const handleCoverChange = (info: any) => {
    console.info('handleCoverChange', info);
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success(t('clientUI.uploadSuccess') + '!');
        setOpusData((data) => ({ ...data, coverUrl: info.file.response.data }));
        setCoverUrl(info.file.response.data);
      } else {
        message.error(info.file.response.msg);
      }
    }
    if (info.file.status === 'error') {
      message.error('File type not supported.');
      return;
    }
  };
  /** currState 0:草稿， 10 ：发布 */
  const handleCommit = useCallback(
    async (currState: number) => {
      try {
        let res: any;
        if (currState === 0) {
          setIsSaveLoading(true);
          setAutoSaveState(1);
          res = await saveDraftOpusReq(opusData);
          setAutoSaveState(2);
        } else {
          setIsLoading(true);
          if (reqStateRef.current) {
            return;
          }
          reqStateRef.current = true;
          res = await publishOpusReq(opusData, spaceId);
        }

        if (res.data.status === 1) {
          if (currState === 0) {
            setPublishDraftUUID(res.data.data);
            setOpusData((data) => ({
              ...data,
              uuid: res.data.data as string,
            }));
          } else {
            setPublishDraftUUID('');

            if (isFromBranch || CBUrl === '/') {
              router.push(
                `/?opusId=${(res.data.data as OpusPublish).id}&uuid=${
                  (res.data.data as OpusPublish).uuid
                }`
              );
            } else {
              router.push(CBUrl);
            }
          }
        } else {
        }
      } catch (error) {
        setAutoSaveState(0);
        reqStateRef.current = false;

        message.error((error as Error).message, 5);
      } finally {
        reqStateRef.current = false;
        setIsLoading(false);
        setIsSaveLoading(false);
      }
    },
    [opusData, setAutoSaveState]
  );

  /** 删除上游 */
  const onSourceDelete = (index: number) => {
    // 从上游branch 过来 删除 后 将上游信息置空
    if (sourceDatas[index].id === upstream?.upstreamOpusId) {
      resetUpstreamAtom();
      setUpstream(null);
    }
    const newItems = [...sourceDatas];
    newItems.splice(index, 1);
    setSourceDatas(newItems);
  };

  useEffect(() => {
    if (opusData.upstreamList && opusData.upstreamList.length) {
      const sourceData: OpusCardInfo[] = opusData.upstreamList.map(
        (item, _) => {
          return {
            ratio: item.ratio,
            id: item.upstreamOpusId!,
            title: item.title,
            uuid: item.uuid,
            opusType: item.opusType,
          };
        }
      );
      setSourceDatas(([] as OpusCardInfo[]).concat(sourceData));
    }
  }, []);

  useEffect(() => {
    const upstreamList: UpstreamOpus[] = sourceDatas.map((item, _) => {
      return {
        ratio: item.ratio ? item.ratio : 0.1,
        upstreamOpusId: item.id!,
        title: item.title,
        uuid: item.uuid,
        opusType: item.opusType,
      };
    });

    if (isFromBranch) {
      resetUpstreamAtom();
      setUpstream(null);
    }

    let ids = upstreamList.map((item) => item.upstreamOpusId);
    setExistIds(ids.join(','));
    const sum = upstreamList.reduce((acc, obj) => acc + obj.ratio, 0);
    setRatioSum(sum);
    setOpusData((data) => ({
      ...data,
      upstreamList: upstreamList,
    }));
  }, [setOpusData, sourceDatas]);

  useEffect(() => {
    const option = {
      series: [
        {
          name: 'Access From',
          type: 'pie',
          emphasis: {
            scale: false,
          },
          radius: [0, '100%'],
          center: ['50%', '50%'],
          label: {
            position: 'inner',
            fontSize: 18,
            formatter: '{d}%',
            color: 'white',
            fontWeight: 500,
          },
          data: [
            {
              name: 'Shareable Revenue',
              value: 1 - ratioSum,
              label: {
                color: 'white',
                formatter: '{d}% {b} ',
              },
              // color: '#231f20',
              itemStyle: {
                color: '#2168c4',
              },
              // 提示框内容，也会显示百分比
            },
            ratioSum > 0
              ? {
                  name: '',
                  value: ratioSum,
                  colorLabel: '#00ff00',
                  label: {
                    color: '#231f20',
                    show: true,
                    // offset: [0, 0],
                  },
                  itemStyle: {
                    color: '#bdd2ee',
                    // borderWidth: 2,
                    // borderColor: 'red',
                  },
                }
              : null,
          ],
        },
      ],
    };
    setEchartsOption(option);
  }, [ratioSum]);

  return (
    <div
      className={clsx(styles.creatPublish, 'flex flex-col p-[30px] w-full ')}
    >
      <div className="flex mt-[45px]">
        {/* preview */}
        <div className="flex flex-col w-[420px] mr-[108px]">
          <div className="text-[#231f20] text-[20px] mt-[20px] font-[500]">
            Preview
          </div>
          <div className="w-[420px] h-[200px] my-[30px]">
            <div
              className="flex flex-col  items-center justify-center border-dashed  h-[200px] w-full border border-[#a9a9a9] relative select-none overflow-hidden p-[10px]"
              style={{ background: 'rgba(216, 215, 215, 0.2)' }}
            >
              {opusData.coverUrl ? (
                <div>
                  <Image className="h-[200px]" src={coverUrl} alt="" />
                  <CloseCircleOutlined
                    style={{ color: 'hotpink', fillRule: 'evenodd' }}
                    className="absolute right-[10px] top-[10px]  text-[18px] text-first bg-white rounded-[18px] overflow-hidden"
                    onClick={() => {
                      setOpusData((data) => ({
                        ...data,
                        coverUrl: '',
                      }));
                    }}
                  />
                </div>
              ) : (
                <UploadImage onChange={handleCoverChange}>
                  <div className="text-[#393939] text-[20px] user cursor-pointer px-[100px] py-[80px]">
                    Upload a cover image
                  </div>
                </UploadImage>
              )}
            </div>
          </div>
          <div className={clsx('text-frist textView', styles.titleInput)}>
            <div>
              <input
                className={styles.titleInput}
                placeholder={'Title'}
                value={opusData?.title}
                onChange={(e) => {
                  if (e.target.value.trim().length <= 75) {
                    setOpusData((data) => ({ ...data, title: e.target.value }));
                  } else {
                    message.warning(t('clientUI.startCreating.titleWarning'));
                  }
                }}
              />
            </div>
            <Divider className="bg-[#e4e0e0]" />

            <TextArea
              className={styles.subTitleInput}
              placeholder={'Subtitle'}
              showCount
              rows={3}
              variant="borderless"
              style={{ resize: 'none' }}
              value={
                opusData?.subTitle!.length > 70
                  ? opusData?.subTitle?.substring(0, 70)
                  : opusData?.subTitle
              }
              maxLength={70}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
              onChange={(e) => {
                if (e.target.value.trim().length > 70) {
                  message.warning(t('clientUI.startCreating.subTitleWarning'));
                } else {
                  const value = e.target.value.replace(/[\r\n]/g, ' ');
                  setOpusData((data) => ({
                    ...data,
                    subTitle: value,
                  }));
                }
              }}
            />
            <Divider className=" bg-[#e4e0e0] !my-[15px_20px]" />
            <div className="text-[#5e5e5e] text-[16px] leading-[23px]">
              Note: Changes made here will affect how your work appears in
              public places like Copus homepage and other social media.
            </div>
          </div>

          <div className="text-[#231f20] text-[20px] mt-[50px] font-[500]">
            Visibility
          </div>
          <div className="mt-[30px]">
            <div className="flex items-center">
              <div className="text-[#231f20] text-[18px] mr-[10px]">
                Store on blockchain
              </div>
              <Switch
                checked={isOnChain}
                onChange={(value) => {
                  console.log('switch', value);
                  setIsOnChain(value);
                  setOpusData((data) => ({
                    ...data,
                    storeOnChain: value,
                  }));
                }}
              ></Switch>
            </div>

            <div className="text-[#5e5e5e] text-[16px]  leading-[23px] mt-[10px]">
              Secure your ownership with a permanent & decentralized storage.
            </div>
            <div className="text-[#5e5e5e] text-[16px]  leading-[23px] mt-[20px]">
              <Radio.Group
                onChange={onChangeRadio}
                value={opusData.accessLevel}
              >
                <div className="flex flex-col">
                  <Radio value={0}>
                    <div className="text-[#231f20] text-[18px] ">Public</div>
                  </Radio>
                  <div className="text-[#5e5e5e] text-[16px]  leading-[23px] mb-[20px] mt-[5px]">
                    Everyone can view your work <br></br>(It will appear on
                    Copus homepage.)
                  </div>
                  <Radio value={20}>
                    <div className="text-[#231f20] text-[18px]">Private</div>
                  </Radio>
                  <div className="text-[#5e5e5e] text-[16px]  leading-[23px]  mb-[20px] mt-[5px]">
                    Only people you choose can view your work<br></br> (It will
                    not appear on Copus homepage. Only people you choose can add
                    it as a source. Visibility changes when a space curates it.)
                    <div
                      className="text-[#2b8649] underline mt-[5px] leading-[23px]  cursor-pointer"
                      onClick={() => {
                        setOpenInviteNewReader(true);
                      }}
                    >
                      Share Privately
                    </div>
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
        </div>
        {/* add sources */}
        <div
          className="flex flex-col !w-[730px] p-[20px_30px] rounded-[15px] justify-between"
          style={{ background: 'rgba(33, 104, 196, 0.05)' }}
        >
          <div className="text-[#231f20] text-[20px]   font-[500]">
            Add sources
            <InfoCircleOutlined
              className="ml-[10px] text-[20px]"
              style={{
                color: '#696969',
                fillRule: 'evenodd',
              }}
            />
          </div>
          <div className="flex h-[500px] justify-start">
            <div
              className="mt-[158px] "
              style={{
                height: '260px',
                width: '260px',
              }}
            >
              {echartsOption && (
                <ReactEcharts
                  option={echartsOption}
                  style={{
                    height: '260px',
                    width: '260px',
                    // border: '1px solid ',
                  }}
                  className="pie-chart  "
                />
              )}
            </div>

            <div className="ml-[40px] w-[380px] flex flex-col justify-start">
              <div className={clsx(styles.selectView, ' w-[360px] h-[48px]')}>
                <Search
                  existIds={existIds}
                  uuid={opusData.uuid}
                  onAddItem={(item) => {
                    // const upstreamItem = item;
                    item.ratio = 0.1;
                    setSourceDatas(sourceDatas?.concat(item));
                  }}
                ></Search>
              </div>
              {/* 添加的上游列表 */}
              <div className=" mt-[20px]">
                <SourceView
                  upstreamList={sourceDatas}
                  onDelete={onSourceDelete}
                  onChange={(item: OpusCardInfo, value: number) => {
                    console.log(item);
                    item.ratio = value / 100;
                    setSourceDatas([...sourceDatas]);
                  }}
                ></SourceView>
                {sourceDatas.length > 0 && (
                  <div className="mt-[10px] text-[#231f20] text-[16px]">
                    Only round numbers from 1 to 100 are accepted
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#231f20] text-[20px] font-[500] mb-[30px]">
              Graph Preview
              <InfoCircleOutlined
                className="ml-[10px] text-[20px]"
                style={{
                  color: '#696969',
                  // fill: 'red',
                  fillRule: 'evenodd',
                }}
              />
            </div>
            <div className="w-full  bg-[#fff] h-[340px] border border-[#e4e0e0]">
              <Graph data={sourceDatas} baseData={opusData} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center mt-[60px] h-[58px] select-none">
        <div
          className="mr-[30px] text-[#231f20] text-[16px] cursor-pointer"
          onClick={() => {
            handleCommit(0);
          }}
        >
          {isSaveLoading && <i className="fa fa-circle-o-notch fa-spin mr-1" />}
          Save Draft
        </div>
        <button
          className="bg-[#f23a00] p-[15px_20px] text-[white] text-[20px] font-[600] rounded-[50px] cursor-pointer"
          onClick={() => {
            handleCommit(10);
          }}
          disabled={isLoading}
        >
          {isLoading && <i className="fa fa-circle-o-notch fa-spin mr-1" />}
          Publish now
        </button>
      </div>
      <CommonModal
        open={openInviteNewReader}
        handleCancelCallback={() => {
          setOpenInviteNewReader(false);
        }}
      >
        <WorkSharePrivate
          opus={opusData}
          close={() => {
            setOpenInviteNewReader(false);
          }}
          dataCallBack={(emails: string[], userIds: number[]) => {
            console.info(emails, userIds);
            sharePrivateHandle(emails, userIds);
          }}
        />
      </CommonModal>
    </div>
  );
};
export default Publish;
