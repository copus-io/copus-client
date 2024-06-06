import { createRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';

import 'cropperjs/dist/cropper.css';
import { useTranslation } from 'react-i18next';
interface IProps {
  handleCropper: (data: any) => void;
  img: any;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
}
const CropperDiv = (props: IProps) => {
  const { t } = useTranslation();

  const { handleCropper, img, aspectRatio, cropShape = 'rect' } = props;
  const defaultSrc = img;
  const cropperRef = createRef<ReactCropperElement>();
  const [image, setImage] = useState<any>(defaultSrc);
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      handleCropper(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL('image/webp')
      );
    }
  };

  return (
    <div className="">
      <Cropper
        ref={cropperRef}
        className={cropShape !== 'rect' ? 'CropperDiv' : ''}
        style={{ height: 400, width: '100%', paddingTop: '30px' }}
        // zoomTo={0.2}
        aspectRatio={aspectRatio}
        // initialAspectRatio={1}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        center={true}
        autoCropArea={1}
        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
        guides={true}
      />
      <div
        onClick={getCropData}
        className="flex items-center  !py-[10px] mt-[40px]  px-[15px] font-[600] rounded-full border  bg-[#fff] hover:bg-[#eee] cursor-pointer"
        style={{
          width: '100px',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '40px auto 0',
        }}
      >
        {t('clientUI.cropper.btnName')}
      </div>
    </div>
  );
};

export default CropperDiv;
