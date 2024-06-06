import { OpusInfoForSubmission } from 'src/data/use-user-creator-center-submission-list';

import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ReactComponent as BackIcon } from 'src/assets/media/svg2/ic-back.svg';
import { spaceLogo } from 'src/components/common';
import { formatTimestamp } from 'src/utils/common';
import { postInfoForListItem } from '../..';

export default function SubmissionItem({
  item,
  onCancelSubmit,
}: {
  item: OpusInfoForSubmission;
  onCancelSubmit: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="flex w-full p-[30px_0px] items-center ">
      {postInfoForListItem(
        'flex-[6] flex items-center text-[16px] text-[#a9a9a9]  overflow-hidden cursor-pointer',
        item,
        router
      )}

      <div
        onClick={() => {
          router.push(item.spaceInfo?.namespace!);
        }}
        className="flex-[3] flex cursor-pointer items-center gap-[10px]"
      >
        {spaceLogo(
          item.spaceInfo?.logoUrl,
          item.spaceInfo?.title,
          36,
          'text-[20px]'
        )}
        <div className="text-[16px]">{item.spaceInfo?.title}</div>
      </div>
      <div className="flex-[2] text-[#484848] text-[16px] flex  items-center">
        {itemStatus(item.currState!)}
      </div>
      <div className=" flex-[2]  text-[#484848] text-[16px] flex items-center">
        {item?.createTime && formatTimestamp(item.createTime as any)}
      </div>

      {item.currState === 0 ? (
        <div
          onClick={onCancelSubmit}
          className="flex-[3] flex justify-center  items-center cursor-pointer"
        >
          <div className="gap-[10px] w-[180px] h-[35px] rounded-[50px] border border-[#696969]  flex justify-center items-center">
            <BackIcon />
            {t('clientUI.creatorCenter.cancelSubmission')}
          </div>
        </div>
      ) : (
        <div className="flex-[3]"></div>
      )}
    </div>
  );

  function itemStatus(status: number) {
    if (status === 0) {
      return 'Pending';
    }
    if (status === 10) {
      return 'Agree';
    }
    if (status === 20) {
      return 'Reject';
    }
  }
}
