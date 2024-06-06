import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { publish } from 'src/utils/event';

interface SignupProps {
  step?: number;
  CBUrl?: string;
  changeStep: (step: number) => void;
}
const CodeSucces = (props: SignupProps) => {
  const { CBUrl } = props;
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-center  h-[500px]">
        <div className="flex flex-col items-center mb-[100px]  justify-center ">
          <div className="text-[38px] leading-[46px] h-[58px] font-medium text-first">
            {t('clientUI.signup.emailVerified')}
            {` :)`}
          </div>
          <div>
            <button
              className="button-green  !justify-center mt-12"
              onClick={(e) => {
                router.push('/');
                publish('Sign_CodeSuccess');
              }}
            >
              {t('clientUI.home.exploreCascades')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodeSucces;
