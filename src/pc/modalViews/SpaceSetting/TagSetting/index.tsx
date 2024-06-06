import { ReactComponent as AddTagIcon } from 'src/assets/media/svg/icon-add-tag.svg';
import { ReactComponent as CheckedIcon } from 'src/assets/media/svg/icon-checked.svg';
import { ReactComponent as ColorPanelIcon } from 'src/assets/media/svg/icon-color-panel.svg';
import { ReactComponent as EditIcon } from 'src/assets/media/svg/icon-edit.svg';
import useSpaceDetailReq from 'src/data/use-space-detail';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Input, Modal, Segmented, Space, Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { HexColorPicker } from 'react-colorful';
import { useTranslation } from 'react-i18next';
import { createSpaceTagReq, delSpaceTagReq, sortSpaceTag } from 'src/api/space';
import { tagItemView } from 'src/components/common';
import useSpaceTagManageReq from 'src/data/use-space-tag-manage';
import { colorConvert } from 'src/utils/common';
import { NORMAL_BACKGROUND_OPACITY } from 'src/utils/statics';
import { colorTemplate } from '../static';
import EditTag from './edit';
import { OpusTagInfo } from 'src/data/use-work-detail';

const TagSetting = ({ spaceId }: { spaceId: string }) => {
  const { t } = useTranslation();
  const [delLoading, setDelLoading] = useState(false); // 删除loading
  const [tag, setTag] = useState('');
  const [color, setColor] = useState('');
  const [segmentedVal, setSegmentedVal] = useState('template'); // 分段控制器
  const [commitLoading, setCommitLoading] = useState(false); // 提交loading
  const [tagId, setTagId] = useState<number>(); // 当前选中的tagid
  const [index, setIndex] = useState(0);
  const [needTag, setNeedTag] = useState(false);
  const [tagAllList, setTagAllList] = useState<any[]>([]);
  const { data: spaceDetail } = useSpaceDetailReq(spaceId);
  const { data, mutate, isLoading } = useSpaceTagManageReq(spaceId);
  useEffect(() => {
    if (spaceDetail) {
      setNeedTag(spaceDetail?.needTag);
    }
    setTagAllList(data ? ([] as OpusTagInfo[]).concat(...data) : []);
  }, [spaceDetail, data]);
  const clearData = () => {
    setTagId(undefined);
    setTag('');
    setColor('');
  };

  const delTagFun = async (tagId: number) => {
    try {
      if (delLoading) return;
      setDelLoading(true);
      const res = await delSpaceTagReq(tagId, spaceId);
      if (res.data.status) {
        message.success(t('clientUI.success') + '!');
        clearData();
        mutate();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setDelLoading(false);
    }
  };
  const changeTagSort = async (list: any) => {
    try {
      const arr = list.map((ele: any, index: number) => {
        return {
          id: ele.id,
          sortOrder: index + 1,
        };
      });

      if (arr && arr.length < 2) {
        return;
      }
      await sortSpaceTag(arr, spaceId);
      mutate();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const delTag = (tagId?: number) => {
    Modal.confirm({
      title: t('clientUI.spaceSetting.tagSetting.delTagTips'),
      icon: <ExclamationCircleFilled />,
      okText: t('clientUI.yes'),
      okType: 'danger',
      cancelText: t('clientUI.no'),
      onOk: () => {
        if (tagId) delTagFun(tagId);
      },
    });
  };

  const del = () => {
    delTag();
  };

  /** 提交 */
  const commitTag = async (id?: Number) => {
    try {
      setCommitLoading(true);
      const params: any = {
        tag,
        tagColor: color,
      };
      if (id) params.id = tagId;
      const res = await createSpaceTagReq(params, spaceId);
      if (res.data.status) {
        message.success(t('clientUI.success') + '!');
        clearData();
        mutate();
        hideAdd();
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setCommitLoading(false);
    }
  };
  const commit = () => {
    commitTag();
  };
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      tagAllList,
      result.source.index,
      result.destination.index
    );
    console.log(items);

    setTagAllList(items);
    changeTagSort(items);
  };

  // 更改状态
  const onChange = (tagId: any, item: any) => {
    item.isDeleted = !item.isDeleted;
    delTagFun(tagId);
  };

  // 隐藏新增
  const [open, setOpen] = useState(false);
  const hideAdd = () => {
    setOpen(false);
  };
  return (
    <div className={`pb-12`}>
      <div className="flex justify-between h-8 text-first">
        <div className="text-first text-[16px]">
          {t('clientUI.spaceSetting.tagSetting.tagSetting')}
        </div>
        <div
          className="flex cursor-pointer items-center h-8 rounded-[16px] px-4 border border-border shadow hover:shadow-hover duration-300"
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddTagIcon className="mr-3" />
          <div>{t('clientUI.spaceSetting.tagSetting.addTag')}</div>
        </div>
      </div>

      {open && (
        <div className="border-borderColor p-[20px] border-[1px]">
          <div className="mb-[20px] ">
            <div className="flex text-first">
              {color && tag ? (
                <div
                  className="px-[10px] border h-[34px] flex items-center text-[14px] rounded-[16px]"
                  style={{
                    borderColor: color,
                    color,
                    background: colorConvert(color, NORMAL_BACKGROUND_OPACITY),
                  }}
                >
                  {tag}
                </div>
              ) : (
                t('clientUI.spaceSetting.tagSetting.tagPreview')
              )}
            </div>
          </div>
          <div className="text-second mb-3">
            {tagId && 'Edit '}
            {t('clientUI.spaceSetting.tagSetting.tagName')}
          </div>
          <Input
            className="input !w-[160px] !h-[40px] !rounded-[10px]"
            value={tag}
            onChange={(e) => {
              if (e.target.value.length <= 16) setTag(e.target.value);
            }}
          />
          <div className="text-second mt-2 text-[14px]">
            *{t('clientUI.spaceSetting.tagSetting.tagDesc')}
          </div>
          <div className="mt-8">
            <div className="">
              <div className="text-second mr-2 mb-[5px]">
                {tagId && 'Edit '}
                {t('clientUI.spaceSetting.tagSetting.tagColor')}
              </div>
              <Segmented
                className="!pl-[0]"
                value={segmentedVal}
                onChange={(val) => {
                  setSegmentedVal(val as string);
                }}
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
                      className={`w-8 cursor-pointer h-8 rounded-full border-[2px] flex items-center justify-center`}
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
                  className="input !w-[160px] !h-[40px] !rounded-[10px] mt-[20px]"
                  value={color}
                  placeholder={t('clientUI.spaceSetting.tagSetting.enter')}
                  onChange={(e) => setColor(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="mt-8">
            {tagId && (
              <span
                className="mt-[6px] underline text-fourth text-[14px] cursor-pointer"
                onClick={del}
              >
                {t('clientUI.spaceSetting.tagSetting.delete')}
              </span>
            )}
            <div className="mt-4 flex">
              <button className="button-green !h-[48px]" onClick={commit}>
                {commitLoading && (
                  <span className="mr-2">
                    <i className="fa fa-circle-o-notch fa-spin " />
                  </span>
                )}
                {t('clientUI.spaceSetting.tagSetting.create')}
              </button>
              <button
                onClick={hideAdd}
                className="!h-[48px] button-white ml-[20px] !px-[20px]"
              >
                {t('clientUI.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 已添加的tag */}
      <div className="mt-6 pb-4 mb-6">
        {isLoading ? (
          <div className="flex items-center h-[60px] justify-center">
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
            loading
          </div>
        ) : tagAllList.length > 0 ? (
          <div>
            <div className="text-second mb-3">{tagAllList.length} Tags</div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: any) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tagAllList.map((item, i) => (
                      <div key={item.id}>
                        <Draggable
                          key={item.id}
                          draggableId={item.tag}
                          index={i}
                        >
                          {(provided: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="py-[20px] px-[10px] border-b-[1px] flex justify-between items-center">
                                {tagItemView(item, () => {
                                  setTag(item.tag);
                                  setColor(item.tagColor);
                                  setTagId(item.id);
                                })}
                                <div className="right flex items-center text-first">
                                  {index !== i + 1 && (
                                    <EditIcon
                                      onClick={() => {
                                        setIndex(i + 1);
                                      }}
                                      className="mr-[20px] cursor-pointer"
                                    ></EditIcon>
                                  )}
                                  <Switch
                                    checked={!item.isDeleted}
                                    onChange={() => onChange(item.id, item)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                        {index === i + 1 && (
                          <EditTag
                            cascadId={spaceId}
                            editData={item}
                            mutate={mutate}
                            cancel={() => {
                              setIndex(0);
                            }}
                          ></EditTag>
                        )}
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div>
            <div className="text-first flex items-center justify-center h-8">
              {t('clientUI.spaceSetting.tagSetting.noData')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TagSetting;
