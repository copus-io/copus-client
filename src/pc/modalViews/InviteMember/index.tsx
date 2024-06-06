import { Input, message } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserForInviteToSpace,
  inviteMemberById,
  userListForInviteToSpace,
} from 'src/api/user';
import { ReactComponent as ChangeIcon } from 'src/assets/media/svg2/ic-change.svg';
import { ReactComponent as InviteWhiteIcon } from 'src/assets/media/svg2/ic-invite-white.svg';
import { ReactComponent as InviteIcon } from 'src/assets/media/svg2/ic-invite.svg';
import { ReactComponent as PostIcon } from 'src/assets/media/svg2/ic-posts.svg';
import { ReactComponent as StreamIcon } from 'src/assets/media/svg2/ic-stream.svg';
import Search from 'src/components/Search';
import { emptyDataTips, userFace } from 'src/components/common';
import { floorFixedNumber, truncateString } from 'src/utils/common';

export default function InviteMembers({ spaceId }: { spaceId: string }) {
  const { t } = useTranslation();
  const onChangeKeyword = (keyword: string) => {
    setPageIndex(1);
    setKeyword(keyword);
  };

  const { TextArea } = Input;

  const [keyword, setKeyword] = useState('');
  const [reqMoreLoading, setReqMoreLoading] = useState(false);
  const [freshCount, setFreshCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [dataList, setDataList] = useState<UserForInviteToSpace[]>([]);

  function onClickShowMore() {
    if (reqMoreLoading) {
      return;
    }
    setPageIndex(pageIndex + 1);
  }

  async function getDataFromServer() {
    setReqMoreLoading(true);
    const res = await userListForInviteToSpace(
      {
        pageSize: 9,
        keyword: keyword,
        pageIndex: pageIndex,
      },
      spaceId
    );

    setReqMoreLoading(false);
    if (res.data.status === 1) {
      let data = res.data.data;
      if (pageIndex > data.pageCount) {
        setPageIndex(1);
      }
      setDataList(data.data);
    } else {
      setDataList([]);
    }
  }

  useEffect(() => {
    getDataFromServer();
  }, [pageIndex, keyword]);

  let showMore = true;

  if (keyword.length > 0 && pageIndex == 1 && dataList.length < 9) {
    showMore = false;
  }

  return (
    <>
      <div className="text-[25px] pt-[30px] font-bold">
        {t('clientUI.curatorCenter.inviteMembers')}
      </div>
      <Search
        searchClassName="mt-[20px] !border-x-[1px] !border-[#d8d7d7] !h-[42px]  !rounded-[15px] !pl-[10px]"
        style={{
          backgroundColor: 'rgba(var(--bg-twelfth), 0.4)',
        }}
        onChange={onChangeKeyword}
      ></Search>
      {userList(showMore)}

      <p className="mt-[20px] text-first text-[20px] font-[500]">
        Invite by email
      </p>
      <div className="w-[full] mt-[20px]">
        <TextArea
          rows={2}
          placeholder="Enter user names or emails, and we will send invite to their email."
        />
      </div>
      <div className={clsx('flex justify-end w-full mt-12')}>
        <button
          className="button-green-small ml-5"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Send Invite
        </button>
      </div>
    </>
  );

  function userList(showMore: boolean) {
    if (dataList.length === 0 && reqMoreLoading === false) {
      return emptyDataTips();
    }
    return (
      <div className="h-[calc(30vh)]">
        <div className="flex flex-wrap gap-[22px] mt-[20px]">
          {dataList.map((item: UserForInviteToSpace) => (
            <div
              className="flex py-[10px] items-center  hover:bg-[#eee] w-[260px] justify-between"
              key={item.id}
            >
              <Link
                className="flex cursor-pointer items-center mr-[2px]"
                href={'user/' + item.namespace}
                target="_blank"
              >
                {userFace(item.faceUrl)}

                <div className="flex flex-col ml-[10px] text-[14px]">
                  <p className="">{truncateString(item.username, 15)}</p>
                  <div className="flex items-center">
                    <PostIcon className="w-[12px]" />
                    <span className="ml-[5px] ">{item.opusCount}</span>
                    <StreamIcon className="w-[12px] ml-[5px]" />
                    <span className="ml-[5px]">
                      {floorFixedNumber(item.tokenAmount || 0, 2)}
                    </span>
                  </div>
                </div>
              </Link>
              {inviteBtn(item)}
            </div>
          ))}
        </div>
        <div
          onClick={onClickShowMore}
          className={`${
            showMore
              ? 'flex w-[200px] mt-[20px] items-center cursor-pointer justify-center m-auto h-[43px] border-bg-twelfth rounded-[15px] border-[2px]'
              : 'hidden'
          }`}
        >
          <div className="flex justify-center items-center mr-[15px] w-[20px] h-[20px] rounded-full bg-[#696969]">
            <ChangeIcon
              className={reqMoreLoading === true ? 'animate-spin' : ''}
            />
          </div>
          {t('clientUI.showBatch')}
        </div>
      </div>
    );
  }

  function inviteBtn(item: UserForInviteToSpace) {
    if (item.isInvited) {
      return (
        <div className="flex items-center gap-[10px] py-[5px] px-[15px] rounded-[100px] border border-solid border-[#696969] bg-[#f3f3f3] cursor-not-allowed">
          <InviteIcon />
          <div className="w-[46px]">Invited</div>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => {
            onClickInvite(item);
          }}
          className="flex items-center gap-[10px] py-[5px] px-[15px] rounded-[100px] border border-solid bg-[#484848] cursor-pointer"
        >
          <InviteWhiteIcon />
          <div className="w-[46px] text-[#fff]">Invite</div>
        </div>
      );
    }
  }

  async function onClickInvite(item: UserForInviteToSpace) {
    item.isInvited = true;
    setFreshCount(freshCount + 1);
    const res = await inviteMemberById({ userIds: [item.id] }, spaceId);
    message.success('success');
  }
}
