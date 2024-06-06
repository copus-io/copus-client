import { createElement } from 'react';
import { ReactComponent as TwitterIcon } from 'src/assets/media/svg/icon-twitter.svg';
import { ReactComponent as DiscardIcon } from 'src/assets/media/svg/icon-discard.svg';
import { ReactComponent as NotionIcon } from 'src/assets/media/svg/icon-notion.svg';
import { ReactComponent as GithubIcon } from 'src/assets/media/svg/icon-github.svg';

/** type */
export const statusType = [
  {
    text: 'Unread',
    value: '1',
  },
  {
    text: 'Published',
    value: '2',
  },
  {
    text: 'Taken-down',
    value: '3',
  },
];

/** 空间角色 */
export const userRole = (role: number) => {
  switch (role) {
    case -1:
      return { roleText: 'Tourist', roleDes: '' };
    case 0:
      return { roleText: 'CREATOR', roleDes: 'Has full access' };
    case 10:
      return {
        roleText: 'ADMIN',
        roleDes:
          'Has full access but cannot transfer ownership, change tax rate and treasury address',
      };
    default:
      return { roleText: 'COLLABORATOR', roleDes: '' };
  }
};

/** 颜色模版 */
export const colorTemplate = [
  {
    color: '#833B3B',
  },
  {
    color: '#A56D19',
  },
  {
    color: '#CAB71F',
  },
  {
    color: '#879A5D',
  },
  {
    color: '#5D9A64',
  },
  {
    color: '#5A8C93',
  },
  {
    color: '#13978F',
  },
  {
    color: '#20476A',
  },
  {
    color: '#6F5392',
  },
  {
    color: '#935A8A',
  },
  {
    color: '#535353',
  },
];

/** 预设额外图片 */
export const presetLinkImag = [
  {
    icon: createElement(NotionIcon),
    link: 'https://arseed.web3infra.dev/wPf-M-4GxfotMfLPLrSuUOgEAsvLbY7scGPeyTtsMjs',
  },
  {
    icon: createElement(TwitterIcon),
    link: 'https://arseed.web3infra.dev/TPWxCNtFky3HLBcLtTNVSwxvahZLWcIdXFu1AKj1Kug',
  },
  {
    icon: createElement(DiscardIcon),
    link: 'https://arseed.web3infra.dev/UwTgAAQp7EmRHuSmTrs3yEZ14cCz0BHPqjaggoH9oVg',
  },
  {
    icon: createElement(GithubIcon),
    link: 'https://arseed.web3infra.dev/bM5ydfyKM5xK7409GqJHmAuQacipCkE708Nej5vuPtE',
  },
];
