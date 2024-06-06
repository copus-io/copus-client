import { Form, Input, message } from 'antd';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createCascadReq } from 'src/api/space';
import CreateFirst from './CreateFirst';
import CreateSecond from './CreateSecond';
import CreateSuccess from './CreateSuccess';
import styles from './index.module.less';

interface Props {
  close: () => void;
}

const Home = (props: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { close } = props;

  const [step, setStep] = useState(1); // 1：input base setting 2: Treasury address 3: set web3
  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  const [logoUrl, setLogoUrl] = useState(''); // logo
  const [coverUrl, setCoverUrl] = useState(''); // 背景图
  const [accessLevel, setAccessLevel] = useState(0); // 等级

  const isWeb3 = Form.useWatch('isWeb3', form); // 是否是web3
  const cascadeName = Form.useWatch('title', form); // 空间name
  const [nameSpace, setNameSpace] = useState<any>('');
  /** 提交 */
  const onFinish = async (values: any) => {
    try {
      if (commitLoading) return;
      setCommitLoading(true);
      const params = {
        ...values,
        logoUrl,
        coverUrl,
        accessLevel,
        taxRatio: Number(values.taxRatio) / 100,
      };
      const res = await createCascadReq(params);
      if (res.data.data) {
        message.success(t('clientUI.success') + '!');
        setNameSpace(res.data.data?.space?.namespace || '');
        setStep(4);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };

  /** 修改步骤 */
  const changeStep = useCallback((step: number) => {
    setStep(step);
  }, []);

  /** 修改步骤 */
  const changeLogo = useCallback((url: string) => {
    setLogoUrl(url);
  }, []);
  const changeCoverUrl = useCallback((url: string) => {
    setCoverUrl(url);
  }, []);
  // 设置等级
  const changeLevel = useCallback((level: number) => {
    setAccessLevel(level);
  }, []);
  const numbers = Array.from({ length: 3 }, (_, index) => index + 1);
  return (
    <div className="h-full overflow-y-auto">
      {step !== 4 ? (
        <div className="min-h-[600px] h-full text-first flex justify-center items-center">
          <Form
            form={form}
            className={styles.formCon}
            style={{ maxWidth: '100%' }}
            onFinish={onFinish}
            initialValues={{
              isWeb3: true,
            }}
            colon={false}
            layout="vertical"
          >
            <div className="stepDiv flex justify-center items-center mt-[100px] mb-[110px]">
              {numbers.map((i) => (
                <div
                  className="w-[30px] h-[8px] mr-[20px] rounded-[10px]"
                  key={i}
                  style={{
                    background: step === i ? '#f21000' : '#e4e0e0',
                  }}
                ></div>
              ))}
            </div>
            <CreateFirst
              logoUrl={logoUrl}
              coverUrl={coverUrl}
              changeLogo={changeLogo}
              changeCoverUrl={changeCoverUrl}
              step={step}
              cascadeName={cascadeName}
              changeStep={changeStep}
              close={close}
            />
            <CreateSecond
              isWeb3={isWeb3}
              step={step}
              changeLevel={changeLevel}
              changeStep={changeStep}
            />
            <div
              className={`flex  flex-col items-center ${
                step === 3 ? '' : 'h-0 overflow-hidden'
              }`}
            >
              <div className="h-[440px] flex flex-col items-center ">
                <div className="text-[38px] leading-[46px] font-medium text-first mb-[10px]">
                  {t('clientUI.createSpace.treasury')}
                </div>
                <div className="text-[20px] mb-[45px]">
                  {t('clientUI.createSpace.later')}
                </div>
                <div>
                  <Form.Item
                    name="taxRatio"
                    className="!mb-[20px] !w-[90px] formLabel"
                    label={t('clientUI.createSpace.taxRate')}
                    rules={[
                      {
                        required: true,
                        message: t('clientUI.createSpace.taxRateMsg'),
                      },
                      {
                        pattern: /^(?:100(?:\.0)?|\d{1,2}(?:\.\d)?)$/,
                        message: t('clientUI.createSpace.taxRateMsg2'),
                      },
                    ]}
                  >
                    <Input
                      className={clsx('input !w-[90px]', styles.inputcon)}
                      suffix="%"
                    />
                  </Form.Item>
                  <Form.Item
                    name="treasuryAddress"
                    label={t('clientUI.createSpace.treasuryAddress')}
                    className="!mb-[20px] formLabel"
                    rules={[
                      {
                        required: isWeb3,
                        message: t('clientUI.createSpace.treasuryAddressMsg'),
                      },
                    ]}
                  >
                    <Input
                      className={clsx('input', styles.inputcon)}
                      placeholder={t(
                        'clientUI.createSpace.treasuryAddressEnter'
                      )}
                    />
                  </Form.Item>
                </div>
              </div>
              <div
                className={clsx(
                  'flex justify-end w-full mt-12',
                  styles.bottomCon
                )}
              >
                <div
                  className="button-cancel"
                  onClick={(e) => {
                    e.preventDefault();
                    changeStep(2);
                  }}
                >
                  {t('clientUI.back')}
                </div>
                <button
                  className="button-green ml-5"
                  onClick={(e) => {
                    e.preventDefault();
                    form.submit();
                  }}
                >
                  {commitLoading && (
                    <span className="mr-2">
                      <i className="fa fa-circle-o-notch fa-spin " />
                    </span>
                  )}
                  {t('clientUI.complete')}
                </button>
              </div>
            </div>
          </Form>
        </div>
      ) : (
        <div className="min-h-[auto] h-full text-first flex justify-center items-center">
          <CreateSuccess nameSpace={nameSpace} step={step} />
        </div>
      )}
    </div>
  );
};
export default Home;
