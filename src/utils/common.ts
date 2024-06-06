import md5 from 'blueimp-md5';
import tinycolor from 'tinycolor2';

export const md5Pwd = (pwd: string) => md5(md5(pwd) + 'babel-admin');

/**
 * Format time to twitter style ones
 * @param time timestamp in millisecond
 * @param ago the 'ago' suffix
 * @returns the time formatted test
 */
export function formatTimestamp(time: number, ago?: boolean) {
  const monthsMap = new Map([
    [0, 'Jan'],
    [1, 'Feb'],
    [2, 'Mar'],
    [3, 'Apr'],
    [4, 'May'],
    [5, 'Jun'],
    [6, 'Jul'],
    [7, 'Aug'],
    [8, 'Sep'],
    [9, 'Oct'],
    [10, 'Nov'],
    [11, 'Dec'],
  ]);

  let now = new Date();
  let then = new Date(time);

  let diff = now.getTime() - then.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 365) {
    return then.toLocaleDateString();
  } else if (days > 0) {
    const thenYear = then.getFullYear();
    const nowYear = now.getFullYear();

    // 检查是否跨年
    if (thenYear !== nowYear) {
      return `${monthsMap.get(then.getMonth())} ${then.getDate()}, ${thenYear}`;
    } else {
      const month = then.getMonth();
      const day = then.getDate();
      return `${monthsMap.get(month)} ${day}`;
    }
  }

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (hours > 0) {
    let t = hours + ' hours';
    if (ago) t += ' ago';
    return t;
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (minutes > 0) {
    let t = minutes + ' mins';
    if (ago) t += ' ago';
    return t;
  }

  return 'just now';
}
export function formatAgoTimestamp(timestamp: number) {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let month = day * 30;
  let year = month * 12;

  let time1 = new Date().getTime(); // 当前的时间戳
  let time2 = timestamp; // 指定时间的时间戳
  let time = time1 - time2;

  let result = null;
  if (time < 0) {
    // alert("null");
  } else if (time / year >= 1) {
    result = Math.floor(time / year) + 'y';
  } else if (time / month >= 1) {
    result = Math.floor(time / month) + 'm';
  } else if (time / week >= 1) {
    result = Math.floor(time / week) + 'w';
  } else if (time / day >= 1) {
    result = Math.floor(time / day) + 'd';
  } else if (time / hour >= 1) {
    result = Math.floor(time / hour) + 'h';
  } else if (time / minute >= 1) {
    result = Math.floor(time / minute) + 'm';
  } else {
    result = 'now';
  }
  return result;
}
/**
 *
 * @param timestamp 时间戳
 * @param isDay 是否只显示到日期 默认false
 * @returns YYYY-MM-DD HH:mm:ss
 */
export function formatTimestampToDate(timestamp: number, isDay?: boolean) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  if (isDay) {
    return `${year}-${month}-${day}`;
  }
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const validateEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

export function getUUID(len: number, radix: number) {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

/**
 * Gets the time value of now in milliseconds.
 * @returns the time value in milliseconds
 */
export function msOfNow() {
  return new Date().getTime();
}

/** nextjs/image loader function */
export const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?width=${width}`;
};

/** 颜色转换 */
export const colorConvert = (hsx?: string, opacity?: number) => {
  if (!hsx) return `rgba(35,31,32,1)`;
  const data = tinycolor(hsx);
  return `rgba(${data._r},${data._g},${data._b},${opacity || 1})`;
};

/** 保留小数 不四舍五入 */
export const floorFixedNumber = (num: number, length: number = 0) => {
  num = num == null ? 0 : num;
  return Math.floor(num * 10 ** length) / 10 ** length;
};
/** 保留小数 不四舍五入 */
export const formatPercentNum = (num: number, length: number = 2) => {
  num = num == null ? 0 : num;
  return (num * 100).toFixed(length);
};
/**
 *
 * @param str
 * @returns 0:text 1:json 2:html
 */
export function isHtmlorJson(str: string) {
  // const StringType = {
  //   JSON: 'json',
  //   HTML: 'html',
  //   TEXT: 'text',
  // };
  try {
    JSON.parse(str);
    return 1;
  } catch (e) {
    const htmlPattern = /<([a-z][a-z0-9]*)\b[^>]*>/i;
    if (htmlPattern.test(str)) {
      return 2;
    } else {
      return 0;
    }
  }
}

export function truncateString(str: string, maxLength: number = 10): string {
  let truncatedStr = '';
  let totalLength = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const isDoubleByteChar = charCode >= 0x4e00 && charCode <= 0x9fff;
    totalLength += isDoubleByteChar ? 2 : 1;
  }
  if (totalLength <= maxLength) {
    return str;
  }

  let currentLength = 0;
  maxLength = maxLength - 3;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const isDoubleByteChar = charCode >= 0x4e00 && charCode <= 0x9fff;
    if (currentLength + (isDoubleByteChar ? 2 : 1) <= maxLength) {
      truncatedStr += str[i];
      currentLength += isDoubleByteChar ? 2 : 1;
    } else {
      truncatedStr += '...';
      break;
    }
  }
  return truncatedStr;
}

export function getStringLength(str: string) {
  let totalLength = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const isDoubleByteChar = charCode >= 0x4e00 && charCode <= 0x9fff;
    totalLength += isDoubleByteChar ? 2 : 1;
  }
  return totalLength;
}
