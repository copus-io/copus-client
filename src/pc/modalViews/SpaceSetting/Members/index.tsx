import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSpaceDetailReq from 'src/data/use-space-detail';
import AllMembers from './AllMembers';
import ApplyJoinExclusiveSpace from './ApplyJoinExclusiveSpace';
import PrivateSpaceInvitedMembers from './PrivateSpaceInvitedMembers';

const Members = ({ spaceId }: { spaceId: string }) => {
  const { t } = useTranslation();

  const [checkValue, setCheckValue] = useState(0);
  let tag = [
    {
      value: 0,
      name: t('clientUI.spaceSetting.users.all'),
      component: <AllMembers spaceId={spaceId} />,
    },
    {
      value: 1,
      name: t('clientUI.spaceSetting.users.join'),
      component: <ApplyJoinExclusiveSpace spaceId={spaceId} />,
    },
    {
      value: 2,
      name: t('clientUI.spaceSetting.users.invited'),
      component: <PrivateSpaceInvitedMembers spaceId={spaceId} />,
    },
  ];
  const { data: spaceInfo } = useSpaceDetailReq(spaceId);
  return (
    <>
      <div className="w-full ">
        <div className="flex ">
          {tag.map((items, index) => {
            if (spaceInfo?.accessLevel === 10) {
              if (index === 2) {
                return;
              }
            }
            if (spaceInfo?.accessLevel === 20) {
              if (index === 1) {
                return;
              }
            }
            if (spaceInfo?.accessLevel === 0) {
              if (index === 1 || index === 2) {
                return;
              }
            }
            return (
              <div
                key={items.name}
                className={`cursor-pointer text-first text-[16px] font-[500] px-[20px] py-[10px] rounded-full  ${
                  checkValue === index ? 'bg-[#f3f3f3] font-[600]' : ''
                }`}
                onClick={() => {
                  setCheckValue(index);
                }}
              >
                {items.name}
              </div>
            );
          })}
        </div>
        <div className="flex-1  pt-[10px]  pr-[12px] h-[100%] ">
          {tag.find((item) => checkValue === item.value)?.component}
        </div>
      </div>
    </>
  );
};

export default Members;
