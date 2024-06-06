import zh from '../lang/zh/zh';
import en from '../lang/en/en';

const resources: any = {
  en,
  zh,
};
export function $tc(code: any = '0') {
  let lang = 'en';
  lang = localStorage.getItem('lang') || 'en';
  console.log(
    '=================',
    resources[lang].codeInfo[code + '_code'],
    lang
  );
  return resources[lang].codeInfo[code + '_code'];
}
