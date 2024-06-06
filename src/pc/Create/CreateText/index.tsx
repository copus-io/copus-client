import { Divider, Input, message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as ErrorIcon } from 'src/assets/media/svg/icon-error.svg';

import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import clsx from 'clsx';
import useCreateData from 'src/hooks/use-create-data';

import { EditorState } from 'lexical';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import router from 'next/router';
import { saveDraftOpusReq } from 'src/api/createOpus';
import { OpusForEditInfo } from 'src/data/use-work-detail';
import { publishDraftUUID } from 'src/recoil/publishDraftUUID';
import { autoSaveStateAtom, publishAtom } from 'src/recoil/publishOpus';
import { isHtmlorJson } from 'src/utils/common';
import styles from './index.module.less';
import { ToolbarConfig } from 's31-editor/dist/types/plugins/ToolbarPlugin';

const LexicalComponent = dynamic(() => import('src/components/Lexical'), {
  ssr: false,
});
let editFlag = false;
const CreateText = (props: {
  opusInfo?: OpusForEditInfo;
  isEdit?: boolean;
  onRender?: (isComplete: boolean) => any;
  onTypeChange?: (type: number) => void;
}) => {
  const { t } = useTranslation();
  const [publishClick, setPublishClick] = useRecoilState(publishAtom);
  const [autoSaveState, setAutoSaveState] = useRecoilState(autoSaveStateAtom); // 自动保存loading
  const [, setPublishDarftUUID] = useRecoilState(publishDraftUUID);
  const uuid = router.query.uuid as string;

  const debounceRef = useRef<any>();

  const { opusInfo, onRender } = props;
  const contentRef = useRef<any>();

  const [initContent, setInitContent] = useState<any>(); // 富文本内容
  const { data, setData } = useCreateData();
  const [textContentString, setTextContentString] = useState<string>(''); // 富文本内容

  const tabList = useMemo<
    {
      title: string;
      key: string;
      value: number;
      toolbarProps: {
        toolbar?: ToolbarConfig;
        showLabel?: boolean;
      };
    }[]
  >(() => {
    return [
      {
        title: t('clientUI.createPost.text'),
        key: 'text',
        value: 10,
        toolbarProps: {
          toolbar: [
            'block-format',
            'font',
            'bold',
            'italic',
            'underline',
            'code-block',
            'link',
            'font-color',
            'bg-color',
            'font-more',
            'insert-image',
            'import-docx',
            'insert-more',
            'code-format',
            'divider',
            'element-format',
          ],
          showLabel: false,
        },
      },
      {
        title: t('clientUI.createPost.image'),
        key: 'image',
        value: 20,
        toolbarProps: {
          toolbar: [
            'insert-image',
            'divider',
            'columns-layout',
            'divider',
            'block-format',
            'divider',
            'element-format',
            'font',
            'bold',
            'italic',
            'underline',
            'font-color',
            'bg-color',
            'font-more',
            'insert-more',
            'code-format',
          ],
          showLabel: true,
        },
      },
      {
        title: t('clientUI.createPost.audio'),
        key: 'audio',
        value: 30,
        toolbarProps: {
          toolbar: [
            'insert-audio',
            'divider',
            'columns-layout',
            'divider',
            'block-format',
            'divider',
            'element-format',
            'font',
            'bold',
            'italic',
            'underline',
            'font-color',
            'bg-color',
            'font-more',
            'insert-more',
            'code-format',
          ],
          showLabel: true,
        },
      },
      {
        title: t('clientUI.createPost.video'),
        key: 'video',
        value: 40,
        toolbarProps: {
          toolbar: [
            'insert-video',
            'divider',
            'columns-layout',
            'divider',
            'block-format',
            'divider',
            'element-format',
            'font',
            'bold',
            'italic',
            'underline',
            'font-color',
            'bg-color',
            'font-more',
            'insert-more',
            'code-format',
          ],
          showLabel: true,
        },
      },
    ];
  }, []);
  const [currentTab, setCurrentTab] = useState(tabList[0]);

  useEffect(() => {
    props.onTypeChange?.(currentTab.value);
  }, [currentTab]);

  useEffect(() => {
    if (opusInfo && opusInfo.content) {
      const type = isHtmlorJson(opusInfo?.content);
      setInitContent(opusInfo.content);
      onRender?.(true);
      setCurrentTab(
        tabList.find((tab) => tab.value === opusInfo.opusType) || tabList[0]
      );
    }
  }, [opusInfo]);

  const [errorNotice, setErrorNotice] = useState({
    title: '',
    content: '',
  }); // 错误提示

  /** 验证发布的字段 */
  const checkFields = useCallback(() => {
    const errorObj = {
      title: data?.title ? '' : t('clientUI.startCreating.titleErrorMsg'),
      content:
        textContentString.length > 0
          ? ''
          : t('clientUI.startCreating.contentErrorMsg'),
    };
    setErrorNotice(errorObj);
    const validated = Object.values(errorObj).filter(Boolean).length === 0;
    console.log(
      'validated',
      Object.values(errorObj).filter(Boolean).length === 0
    );

    if (!validated) contentRef.current.scrollTo(0, 0);
    return validated;
  }, [data, t, textContentString]);

  /** 监听富文本内容 */
  const onChangeContent = useCallback(
    (editorState?: EditorState, html?: any) => {
      editorState?.read(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        setTextContentString(dom.body.textContent ?? '');

        setData((data) => ({
          ...data,
          content: JSON.stringify(editorState.toJSON()),
        }));
      });

      if (html.length > 0) editFlag = true;
    },
    [setData]
  );

  const handleCommit = useCallback(
    async (params: any) => {
      try {
        let res;
        setAutoSaveState(1);
        console.log('params', params);
        res = await saveDraftOpusReq(params);
        setAutoSaveState(2);
        if (res.data.status === 1) {
          setPublishDarftUUID(res.data.data);
          setData({
            ...params,
            uuid: res.data.data,
          });
        } else {
        }
      } catch (error) {
        setAutoSaveState(0);
        message.error((error as Error).message, 5);
      } finally {
      }
    },
    [data, setAutoSaveState, setData]
  );

  const debounceSaveDraft = useMemo(() => {
    debounceRef.current = debounce(handleCommit, 10000);
    return debounceRef.current;
  }, [handleCommit]);

  /** 自动保存 */
  useEffect(() => {
    if (data.title && data.content && editFlag) {
      editFlag = false;
      debounceSaveDraft({ ...data, opusType: currentTab.value });
    }
    return () => {
      debounceRef.current.cancel();
    };
  }, [data, data.content, data.title, debounceSaveDraft, currentTab]);

  useEffect(() => {
    if (publishClick) {
      editFlag = false;
      const checked = checkFields();
      if (checked) {
        setData((currentData) => {
          let returnData = currentData;
          if (!data.subTitle) {
            let subTitle = '';
            if (textContentString.length > 70) {
              subTitle = textContentString.substring(0, 70);
            } else {
              subTitle = textContentString;
            }
            returnData = {
              ...currentData,
              subTitle: subTitle,
            };
          }
          console.log('returnData', returnData);
          handleCommit(returnData);
          return returnData;
        });
      }
      setPublishClick(false);
    }
  }, [publishClick, setData, checkFields, textContentString, handleCommit]);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      ref={contentRef}
    >
      <div className={clsx('mt-[40px] h-[calc(100vh-200px)]  w-[1250px]')}>
        <div
          className="relative  w-full min-w-[350px] bg-white/80 "
          style={{ margin: '0 auto' }}
        >
          <div>
            <Input
              className="titleInput"
              placeholder={t('clientUI.startCreating.titleTitle')}
              value={data?.title}
              onChange={(e) => {
                editFlag = true;
                if (e.target.value.trim().length <= 75) {
                  setData((data) => ({ ...data, title: e.target.value }));
                } else {
                  message.warning(t('clientUI.startCreating.titleWarning'));
                }
              }}
            />
            {errorNotice.title && (
              <div className="flex mt-[2px] h-[18px] items-center text-[14px] text-error">
                <ErrorIcon className="mr-[5px]" />
                {errorNotice.title}
              </div>
            )}
          </div>

          <Divider className="bg-[#e4e0e0] !mb-[16px] !mt-[20px]" />

          <div className={styles['tab-wrap']}>
            {tabList.map((tab) => (
              <div
                className={`tab ${currentTab.key} ${
                  tab === currentTab ? 'active' : ''
                }`}
                key={tab.key}
                onClick={() => {
                  setCurrentTab(tab);
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>
          <div
            className={`flex flex-col h-[calc(100vh-250px)] w-[1250px] ${
              styles[`${currentTab.key}-editor-main`]
            }`}
          >
            {props.isEdit ? (
              initContent && (
                <LexicalComponent
                  onChange={onChangeContent}
                  initialValue={initContent}
                  toolbar={currentTab.toolbarProps.toolbar}
                  showLabel={currentTab.toolbarProps.showLabel}
                />
              )
            ) : (
              <LexicalComponent
                onChange={onChangeContent}
                toolbar={currentTab.toolbarProps.toolbar}
                showLabel={currentTab.toolbarProps.showLabel}
              />
            )}

            {errorNotice.content && (
              <div className="flex h-[18px] items-center mt-[5px] text-[14px] text-error ">
                <ErrorIcon className="mr-[5px]" />
                {errorNotice.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateText;
