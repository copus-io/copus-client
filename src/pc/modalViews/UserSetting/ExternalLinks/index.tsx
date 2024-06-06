import { ExclamationCircleFilled } from '@ant-design/icons';
import { Avatar, Modal, message } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteUserLinkReq } from 'src/api/space/piece';
import { ReactComponent as AddTagIcon } from 'src/assets/media/svg/icon-add-tag.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/media/svg/icon-delete.svg';
import { ReactComponent as EditIcon } from 'src/assets/media/svg/icon-edit.svg';
import type { SpaceExternalLinkInfo } from 'src/data/use-user-link-list';
import { useExternalLinksReq } from 'src/data/use-user-link-list';
import useRouterParams from 'src/hooks/use-router-params';
import AddLinkModal from './AddLinkModal';
const ExternalLinks = () => {
  const { userId } = useRouterParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [editData, setEditData] = useState<SpaceExternalLinkInfo>();
  const [index, setIndex] = useState(0);

  /** 接口-额外链接 */
  const { data = [], isLoading, mutate } = useExternalLinksReq(userId);
  /** 关闭弹框 */
  const handleCancelCallback = useCallback(
    (isRequest: boolean) => {
      if (isRequest) {
        mutate();
        setOpen(false);
      } else {
        setOpen(false);
      }
      setIndex(0);
      setEditData(undefined);
    },
    [mutate]
  );

  /** 删除 */
  const delLink = (id: number) => {
    Modal.confirm({
      title: t('clientUI.spaceSetting.externalLinks.delete'),
      icon: <ExclamationCircleFilled />,
      okText: t('clientUI.yes'),
      okType: 'danger',
      cancelText: t('clientUI.no'),
      onOk: async () => {
        try {
          if (delLoading) return;
          setDelLoading(true);
          const res = await deleteUserLinkReq(id, userId);
          if (res.data.status) {
            message.success(t('clientUI.success'));
            mutate();
          }
        } catch (error) {
        } finally {
          setDelLoading(false);
        }
      },
    });
  };
  return (
    <div className="w-[100%]">
      <div className="flex justify-between ">
        <div className="text-first text-[20px]">
          {t('clientUI.spaceSetting.externalLinks.external')}
        </div>
        <div
          className="flex cursor-pointer items-center h-8 rounded-[16px] px-4 border border-border shadow hover:shadow-hover duration-300"
          onClick={() => {
            setIndex(0);
            setEditData(undefined);
            setOpen(true);
          }}
        >
          <AddTagIcon className="mr-3" />
          <div className="text-first">
            {t('clientUI.spaceSetting.externalLinks.addLink')}
          </div>
        </div>
      </div>
      <div>
        {isLoading && (
          <div className="flex items-center h-[200px] justify-center">
            <span className="mr-2">
              <i className="fa fa-circle-o-notch fa-spin " />
            </span>
            {t('clientUI.loading')}
          </div>
        )}
        <div className="text-second mt-3">
          {data.length} {t('clientUI.spaceSetting.externalLinks.linkCount')}
        </div>
        {index === 0 && (
          <AddLinkModal
            open={open}
            handleCancelCallback={handleCancelCallback}
          />
        )}

        {data.length > 0 ? (
          <div className="">
            {data.map((item, i) => (
              <div key={item.id}>
                {index !== i + 1 && (
                  <div className="pt-3 mt-5 pb-4 pl-5 pr-6 border-borderColor border rounded-[10px] flex justify-between">
                    <div>
                      <div className="text-first">{item.name}</div>
                      <div className="flex items-center mt-5">
                        <Avatar size={40} src={item.iconUrl} />
                        <div
                          className="ml-[18px] w-[407px] text-first p-[10px] flex items-center min-h-10 h-auto bg-border-second rounded-[10px]"
                          style={{
                            wordBreak: 'break-all',
                          }}
                        >
                          {item.link}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center mt-1">
                      <EditIcon
                        className="text-second cursor-pointer text-[18px]"
                        onClick={() => {
                          setOpen(true);
                          setIndex(i + 1);
                          setEditData(item);
                        }}
                      />
                      <DeleteIcon
                        className="mt-7 cursor-pointer"
                        onClick={() => delLink(item.id)}
                      />
                    </div>
                  </div>
                )}
                {index === i + 1 && (
                  <AddLinkModal
                    open={open}
                    editData={editData}
                    handleCancelCallback={handleCancelCallback}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading &&
          data.length > 0 && (
            <div className="h-[200px] flex flex-col items-center justify-center">
              <div
                className="link-underline cursor-pointer"
                onClick={() => setOpen(true)}
              >
                Start a new link
              </div>
              <div className="text-first">
                Not any link in your timeline yet.
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default ExternalLinks;
