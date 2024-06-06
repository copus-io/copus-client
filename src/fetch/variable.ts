export const apiHost =
  process.env.NEXT_PUBLIC_API_HOST ?? 'https://api.cascad3.com';
// process.env.NEXT_PUBLIC_API_HOST ?? 'https://api.client.prod.copus.io';

export const project = process.env.NEXT_PUBLIC_PROJECT;

export const baseURL =
  process.env.NEXT_PUBLIC_API_BASEURL ??
  'https://api.cascad3.com/cascad3-clientv2';
// 'http://localhost:8081';

export const BASE_CONFIG = {
  baseURL,
};

console.info('version', new Date().getUTCFullYear(), new Date().getDay());
