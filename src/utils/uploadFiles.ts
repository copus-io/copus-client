// import { memo, useCallback } from "react";
import { uploadImage } from 'src/api/common';
import { compressImage } from './compressImage';
/* 
 type 文件类型 默认是图片，audio == 1，video ==2
*/
const UploadFiles = (files: any, type?: number) => {
  return new Promise<any>((resolve, reject) => {
    if (type !== 0) {
      // let file = new File([files, files.name, { type: files.type });
      // console.log('result', result, files, file);
      const formData = new FormData();
      formData.append('file', files);
      uploadImage(formData)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        })
        .finally();

      return;
    }

    compressImage(files).then((myImage) => {
      const formData = new FormData();
      formData.append('file', myImage);
      uploadImage(formData)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};
export default UploadFiles;
