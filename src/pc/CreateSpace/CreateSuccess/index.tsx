import { useRouter } from 'next/router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface CreateFirstProps {
  step: number;
  nameSpace: string;
}

const CreateFirst = (props: CreateFirstProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { step, nameSpace } = props;

  return (
    <div className={`flex flex-col items-center text-first mt-[80px]`}>
      <div className="img w-[120px] h-[120px] rounded-[50%] bg-[#d9d9d9]"></div>
      <div className="text-[38px] font-[500] text-[#231f20] mt-[25px]">
        You space is ready!
      </div>
      <div className="text-[20px] font-[0] text-[#231f20]">
        Invite some creative minds to join!
      </div>
      <div className="flex items-center justify-center mt-[25px] mb-[80px]">
        {/* <button className="button-green ml-5" onClick={(e) => {}}>
          <InviteIcon className="mr-[10px]" /> Invite
        </button> */}
        <button
          className="button-kong ml-5"
          onClick={(e) => {
            router.push(`/${nameSpace}`);
            e.stopPropagation();
          }}
        >
          Go to space
        </button>
      </div>
    </div>
  );
};
export default memo(CreateFirst);
