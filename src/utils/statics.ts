/**
 * 公共静态变量
 */
export const IS_TEST =
  process.env.NEXT_PUBLIC_PRODTEST || process.env.NODE_ENV === 'development';

export const EVERYPAY_IS_TEST =
  process.env.NEXT_PUBLIC_EVERYPAY_PRODTEST ||
  process.env.NODE_ENV === 'development';

// everypay 路径
export const EVERYPAY_HOST = EVERYPAY_IS_TEST
  ? 'https://app-dev.everpay.io/'
  : 'https://app.everpay.io/';

// everypay 交易路径
export const EVERYPAY_TRADE_HOST = EVERYPAY_IS_TEST
  ? 'https://scan-dev.everpay.io/tx/'
  : 'https://scan.everpay.io/tx/';

export const routeBasename: string | undefined =
  process.env.NEXT_PUBLIC_ROUTE_BASENAME ?? undefined;

export const clientApiHost: string = 'https://babeluniverse.com';

/** 防抖时长 */
export const THROTTLE_TIME = 5000;

/** 默认pageSize */
export const DEFAULT_PAGE_SIZE = 10;

/** token */
export const TOKEN = 'authorization';

/** 常态背景透明度配置 */
export const NORMAL_BACKGROUND_OPACITY = 0.1;

/** 选中背景透明度配置 */
export const CHECKED_BACKGROUND_OPACITY = 0.2;
