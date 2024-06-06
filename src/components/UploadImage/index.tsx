import { message, Upload, UploadProps } from 'antd';
import { memo, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonModal } from 'src/components/ModalPro';
import { baseURL } from 'src/fetch/variable';
import { compressImage } from 'src/utils/compressImage';
import CropperDiv from './cropper';

interface UploadImageProps extends UploadProps {
  children: ReactNode;
  aspect?: number;
  width?: number;
  height?: number;
  isCrop?: boolean;
  cropShape?: 'rect' | 'round';
  maxSize?: number;
  maxWidth?: number;
  maxHeight?: number;
  minZoom?: number;
  onChange: (data: any) => void;
}

const UploadImage = (props: UploadImageProps) => {
  const { t } = useTranslation();

  const {
    children,
    aspect,
    width,
    isCrop = true,
    cropShape = 'rect',
    height,
    maxSize = 5 * 1024,
    maxWidth = 1920,
    onChange,
    ...rest
  } = props;
  const minZoom = props.minZoom || 0.5;
  const [open, setOpen] = useState<boolean>(false);
  const [img, setImg] = useState<any>('');
  const handleCancelCallback = () => {
    setOpen(false);
  };
  const base64ToFile = (
    base64Data: any,
    fileName: string,
    fileType: string = 'image/webp'
  ) => {
    // 将 base64 数据解码为二进制数据
    return fetch(base64Data)
      .then((res) => res.blob())
      .then((blob) => new File([blob], fileName, { type: fileType }));
  };

  const handleCropper = (data: any) => {
    // console.log('~log=======================', data);
    setOpen(false);
    message.info(t('clientUI.toast.uploading'));
    base64ToFile(data, 'image.webp').then((file) => {
      handleUpload(file);
    });
  };
  const handleUpload = (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${baseURL}/client/common/uploadImage2S3`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded successfully:', data);
        onChange({
          file: {
            status: 'done',
            response: {
              data: data.data,
            },
          },
        });
      })
      .catch((error) => {
        onChange(error);
        console.error('Error uploading file:', error);
      });
  };
  return (
    <>
      {isCrop ? (
        <Upload
          action={`${baseURL}/client/common/uploadImage2S3`}
          showUploadList={false}
          beforeUpload={(file) => {
            return new Promise((resolve, reject) => {
              let img = new Image();
              img.src = URL.createObjectURL(file);
              img.onload = () => {
                setOpen(true);
                setImg(img.src);
              };
            });
          }}
          {...rest}
        >
          {children}
        </Upload>
      ) : (
        <Upload
          action={`${baseURL}/client/common/uploadImage2S3`}
          showUploadList={false}
          beforeUpload={async (file) => {
            const imgFile = await compressImage(file);
            return imgFile;
          }}
          {...rest}
        >
          {children}
        </Upload>
      )}
      {open && (
        <CommonModal
          open={open}
          handleCancelCallback={handleCancelCallback}
          title={t('clientUI.cropper.title')}
        >
          <CropperDiv
            handleCropper={handleCropper}
            img={img}
            cropShape={cropShape}
            aspectRatio={aspect}
          />
        </CommonModal>
      )}
    </>
  );
};
export default memo(UploadImage);
