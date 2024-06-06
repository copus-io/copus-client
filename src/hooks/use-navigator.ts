export function isWebView() {
  if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
    // 在微信浏览器中打开
    return true;
  } else {
    return false;
    // 不在微信浏览器中打开
  }
}
