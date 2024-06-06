import { Input, Segmented, Space, message } from 'antd';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import { createSpaceTagReq } from 'src/api/space';
import { ReactComponent as CheckedIcon } from 'src/assets/media/svg/icon-checked.svg';
import { ReactComponent as ColorPanelIcon } from 'src/assets/media/svg/icon-color-panel.svg';
import { colorTemplate } from '../static';
interface IProps {
  cascadId: string;
  editData?: any;
  mutate: () => void;
  cancel: () => void;
}

const Edit = (props: IProps) => {
  const { t } = useTranslation();
  const { cascadId, editData, mutate, cancel } = props;
  const [tag, setTag] = useState(editData.tag);
  const { id } = editData;
  const [color, setColor] = useState(editData.tagColor);
  const [segmentedVal, setSegmentedVal] = useState('template'); // 分段控制器
  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  /** 提交 */
  const commitTag = async () => {
    try {
      setCommitLoading(true);
      const params: any = {
        tag,
        tagColor: color,
      };
      if (id) params.id = id;
      const res = await createSpaceTagReq(params, cascadId);
      if (res.data.status) {
        message.success(t('clientUI.success'));
        mutate();
        cancel();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  const cancelCallBack = () => {
    cancel();
  };
  return (
    <div className="border-borderColor p-[20px] border-[1px]">
      <div className="text-first mb-3">
        {t('clientUI.spaceSetting.tagSetting.tagName')}
      </div>
      <Input
        className="input !w-[160px] !h-[40px] !rounded-[10px]"
        value={tag}
        onChange={(e) => {
          if (e.target.value.length <= 16) setTag(e.target.value);
        }}
      />
      <div className="text-first mt-2 text-[14px]">
        {t('clientUI.spaceSetting.tagSetting.tagDesc')}
      </div>
      <div className="mt-8">
        <div className="">
          <div className="text-first mb-[5px]">
            {t('clientUI.spaceSetting.tagSetting.tagColor')}
          </div>
          <Segmented
            className="text-first !pl-[0]"
            value={segmentedVal}
            onChange={(val) => setSegmentedVal(val as string)}
            options={[
              {
                label: t('clientUI.spaceSetting.tagSetting.template'),
                value: 'template',
                className:
                  segmentedVal === 'template'
                    ? 'ant-segmented-item ant-segmented-item-selected'
                    : 'ant-segmented-item text-first',
              },
              {
                label: t('clientUI.spaceSetting.tagSetting.colorPanel'),
                value: 'colorPanel',
                className:
                  segmentedVal === 'colorPanel'
                    ? 'ant-segmented-item ant-segmented-item-selected'
                    : 'ant-segmented-item text-first',
              },
              {
                label: t('clientUI.spaceSetting.tagSetting.input'),
                value: 'input',
                className:
                  segmentedVal === 'input'
                    ? 'ant-segmented-item ant-segmented-item-selected'
                    : 'ant-segmented-item text-first',
              },
            ]}
          />
        </div>
        <div className="mt-[20px]">
          {segmentedVal === 'template' ? (
            <Space size={12} wrap className="w-[164px]">
              {colorTemplate.map((item) => (
                <div
                  key={item.color}
                  className={`w-8 cursor-pointer h-8  rounded-full border-[2px] flex items-center justify-center`}
                  style={{
                    background: item.color,
                    borderColor:
                      item.color === color
                        ? 'rgba(var(--text-first), 1)'
                        : item.color,
                  }}
                  onClick={() => setColor(item.color)}
                >
                  {item.color === color && <CheckedIcon />}
                </div>
              ))}
              <div className="w-8 cursor-pointer h-8 rounded-full border border-first flex items-center justify-center">
                <ColorPanelIcon
                  className="cursor-pointer"
                  onClick={() => setSegmentedVal('colorPanel')}
                />
              </div>
            </Space>
          ) : segmentedVal === 'colorPanel' ? (
            <div className="flex-1 mt-[20px]">
              <HexColorPicker
                color={color}
                onChange={(color) => setColor(color)}
              />
            </div>
          ) : (
            <Input
              className="input mt-[20px] !w-[160px] !h-[40px] !rounded-[10px]"
              value={color}
              placeholder={t('clientUI.spaceSetting.tagSetting.enter')}
              onChange={(e) => setColor(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="mt-4 flex">
          <button className="button-green !h-[48px]" onClick={commitTag}>
            {commitLoading && (
              <span className="mr-2">
                <i className="fa fa-circle-o-notch fa-spin " />
              </span>
            )}
            {t('clientUI.saveChanges')}
          </button>
          <button
            className="!h-[48px] button-white ml-[20px] !px-[20px]"
            onClick={cancelCallBack}
          >
            {t('clientUI.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Edit;
