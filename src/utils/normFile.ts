import { message } from 'antd';

export default function normFile(e: any) {
  if (Array.isArray(e)) {
    return e;
  }
  if (!e.file.status) {
    let _arr: any[] = [];
    for (let i = 0; i < e.fileList.length; i++) {
      const item = e.fileList[i];
      if (item.uid === e.file.uid) {
        _arr = [...e.fileList.slice(0, i), ...e.fileList.slice(i + 1)];
        break;
      }
    }
    return _arr;
  }
  if (e.file.status === 'done') {
    // 后端判断的上传失败
    if (e.file?.response?.status !== 1) {
      message.warning(e.file?.response?.msg);
    }

    let fileList = [...e.fileList];

    // 把所有上传的地址赋值到file.url;
    fileList = fileList.map((file) => {
      if (file.response) {
        if (file.response.status === 1) {
          file.url = file.response?.data;
        } else {
          file.status = 'error';
        }
      }
      return file;
    });
    return fileList;
  }
  return e.fileList;
}
