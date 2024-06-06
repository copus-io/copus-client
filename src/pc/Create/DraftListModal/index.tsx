import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import ModalPro from 'src/components/ModalPro';
import { formatTimestamp } from 'src/utils/common';

import { useRouter } from 'next/router';
import { deleteDraft } from 'src/api/work';
import { ReactComponent as IconDelete } from 'src/assets/media/svg2/ic-delete.svg';
import { ReactComponent as IconEdit } from 'src/assets/media/svg2/ic-edit.svg';
import { emptyDataTips } from 'src/components/common';
import useCreatorCenterDraftListReq, {
  OpusInfoForDraft,
} from 'src/data/use-user-creator-center-draft-list';

// https://app.zeplin.io/project/65dfeff4065151651326d684/screen/66163b67fb49aef712456ba7
interface DraftListModalProps {
  open: boolean;
  handleCancelCallback: () => void;
}

export default function DraftListModal({
  open,
  handleCancelCallback,
}: DraftListModalProps) {
  const { t } = useTranslation();

  const onCancel = async () => {
    handleCancelCallback();
  };

  const workTypeItems = [
    {
      type: 10,
      title: t('clientUI.createPost.text'),
      color: '#ffa902',
    },
    {
      type: 20,
      title: t('clientUI.createPost.image'),
      color: '#ea7db7',
    },
    {
      type: 30,
      title: t('clientUI.createPost.audio'),
      color: '#74b3ce',
    },
    {
      type: 40,
      title: t('clientUI.createPost.video'),
      color: '#2b8649',
    },
  ];

  const onClickType = (typeIndex: number) => {
    setSelectIndex(typeIndex);
  };

  const router = useRouter();
  const [selectIndex, setSelectIndex] = useState(0);
  const [containerRef, setContainerRef] = useState<any>();
  const [draftList, setDraftList] = useState<OpusInfoForDraft[]>([]);

  const { data, size, total, setSize } = useCreatorCenterDraftListReq({
    pageSize: 8,
    opusType: workTypeItems[selectIndex].type,
  });

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || draftList.length === total;
  const loadMoreData = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  useEffect(() => {
    if (data) {
      setDraftList(([] as OpusInfoForDraft[]).concat(...data));
    }
  }, [data]);

  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        centered
        width={750}
        destroyOnClose={true}
        onCancel={() => onCancel()}
        getContainer=".cascade_con"
        footer={false}
      >
        {contentBody()}
      </ModalPro>
    </div>
  );

  function contentBody() {
    let currColor = workTypeItems[selectIndex].color;
    return (
      <div className="px-[30px] h-[750px]">
        <div className="flex justify-center gap-[40px] text-[22px] pt-[60px]">
          {workTypeItems.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  onClickType(index);
                }}
                className={clsx(
                  'cursor-pointer ',
                  index === selectIndex
                    ? `font-[500] border-b border-b-[4px]`
                    : 'font-[400]'
                )}
                style={index === selectIndex ? { borderColor: currColor } : {}}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        {isEmpty ? emptyDataTips() : scrollList()}
      </div>
    );
  }

  function scrollList() {
    return (
      <>
        <div className="flex pt-[30px] text-[16px] text-[#a9a9a9]">
          <div className="flex-[5]">Post</div>
          <div className="flex-[7]">Saved date</div>
        </div>

        <div
          className="max-h-[calc(75vh-150px)] pt-[10px] overflow-y-auto"
          ref={(node) => {
            if (node !== null) {
              setContainerRef(node);
            }
          }}
        >
          {containerRef && (
            <InfiniteScroll
              next={loadMoreData}
              dataLength={draftList.length}
              hasMore={!isReachingEnd}
              scrollableTarget={containerRef}
              loader={<div />}
            >
              {draftList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="py-[30px] px-[10px] flex items-center hover:bg-[#eee] "
                  >
                    <div className="flex items-center gap-[12px] flex-[1]">
                      <img className="w-[70px]" src={item.coverUrl} />
                      <div>{item.title}</div>
                    </div>
                    <div className="flex-[1]">
                      {item?.editTime && formatTimestamp(item.editTime as any)}
                    </div>
                    <div className="flex items-center gap-[20px]">
                      <div
                        onClick={() => {
                          toEdit(item);
                        }}
                        className="cursor-pointer  flex w-[35px] h-[35px] items-center justify-center border-[1px] rounded-full"
                      >
                        <IconEdit></IconEdit>
                      </div>
                      <div
                        onClick={() => {
                          toDelete(item);
                        }}
                        className="cursor-pointer flex w-[35px] h-[35px] items-center justify-center border-[1px] rounded-full"
                      >
                        <IconDelete></IconDelete>
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          )}
        </div>
      </>
    );
  }

  function toEdit(item: OpusInfoForDraft) {
    router.push(`/create?uuid=${item?.uuid}&cburl=${router.asPath}`);
    return;
  }
  async function toDelete(item: OpusInfoForDraft) {
    const res = await deleteDraft({
      id: item.id!,
    });
    if (res.data.status === 1) {
      const newArr = draftList.filter((value) => value !== item);
      setDraftList(newArr);
    }
  }
}
