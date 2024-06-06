import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LogoIcon } from 'src/assets/media/svg2/ic-copus.svg';
const Links = () => {
  const { t } = useTranslation();
  const linksList = [
    {
      name: t('clientUI.about'),
      link: 'https://www.copus.io/copus',
    },
    {
      name: t('clientUI.support'),
      link: 'https://www.copus.io/support',
    },
    {
      name: t('clientUI.contactUs'),
      link: 'https://www.copus.io/work/fec019612d419aedd22108703dd6d153adf229eb',
    },
    {
      name: t('clientUI.twitter'),
      link: 'https://twitter.com/Copus_io',
    },
    {
      name: t('clientUI.discord'),
      link: 'https://discord.gg/babeldao-981628005526962206',
    },
    {
      name: t('clientUI.tAP'),
      link: 'https://www.copus.io/work/565b548277674c3bae3ccc016c7f58a2',
    },
  ];

  let currYear = new Date().getFullYear();

  return (
    <div className="py-[20px] pl-[20px] text-[12px] text-[#5e5e5e]">
      <LogoIcon className="mb-[15px]" />
      <div className="flex flex-wrap items-start">
        {linksList.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            target="blank"
            className="flex items-center mr-[5px]"
          >
            <div className="w-[3px] h-[3px] rounded-full bg-[#5e5e5e]"></div>
            <span className="ml-[2px]">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className=" mt-[10px]">© {currYear} S31 Labs</div>
    </div>
  );
};

export default Links;
