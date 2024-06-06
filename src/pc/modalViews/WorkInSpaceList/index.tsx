import Link from 'next/link';
import { useState } from 'react';
import { takeDownFromSpaceReq } from 'src/api/work';
import { spaceLogo, spaceParams } from 'src/components/common';
import { SpaceMetaInfo } from 'src/data/use-opus-inSpaces-list';
import { OpusInfoForPublished } from 'src/data/use-user-creator-center-published-list';
import { KeyedMutator } from 'swr';

export default function WorkInSpaceList({
  workInfo,
  mutate,
}: {
  workInfo: OpusInfoForPublished;
  mutate: KeyedMutator<any>;
}) {
  const [dataList, setDataList] = useState(workInfo.spaceInfos);
  const [loading, setLoading] = useState(false);
  const [currId, setCurrId] = useState(0);

  return (
    <div className="max-h-[calc(70vh)] min-h-[calc(40vh)]">
      <div className="pt-[30px] pl-[20px] text-[25px] font-[600]">
        Spaces of {workInfo.title}
      </div>
      <div className="overflow-y-auto">
        {dataList?.map((spaceInfo: SpaceMetaInfo) => {
          return (
            <div
              key={spaceInfo.id}
              className="px-[20px] py-[30px] flex items-center justify-between"
            >
              <div className="flex gap-[10px]">
                {spaceLogo(
                  spaceInfo.logoUrl,
                  spaceInfo.title,
                  56,
                  'text-[40px]'
                )}
                <div>
                  <div className="text-[18px] font-[500]">
                    {spaceInfo.title}
                  </div>
                  {spaceParams(
                    spaceInfo.rewardAmount,
                    spaceInfo.userCount,
                    spaceInfo.downstreamCount
                  )}
                </div>
              </div>
              <div className="flex gap-[10px]">
                <Link
                  className="px-[15px] py-[8px] rounded-full bg-[#000] border text-[14px] text-[#fff] font-[500] hover:!text-[#fff] hover:shadow-hover"
                  href={spaceInfo.namespace!}
                  target="_blank"
                >
                  Visit
                </Link>
                <div
                  onClick={async () => {
                    if (loading) return;
                    setCurrId(spaceInfo.id!);
                    setLoading(true);
                    const res = await takeDownFromSpaceReq({
                      opusId: workInfo.id,
                      spaceId: spaceInfo.id,
                    });
                    if (res.data.status === 1) {
                      const newArr = dataList.filter(
                        (value) => value.id !== spaceInfo.id
                      );
                      setDataList(newArr);
                      workInfo.spaceInfos = newArr;
                      mutate();
                    }
                    setLoading(false);
                  }}
                  className="px-[15px] py-[8px] rounded-full border text-[14px] font-[500] hover:shadow-hover cursor-pointer"
                >
                  Take-down
                  {loading && currId === spaceInfo.id && (
                    <i className="fa fa-circle-o-notch fa-spin ml-[4px]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
