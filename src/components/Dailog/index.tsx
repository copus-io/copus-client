import { memo } from 'react';
import ModalPro from 'src/components/ModalPro';
import styles from './index.module.less';
// const CreateOpus = dynamic(() => import('src/pc/CreateOpus'), {
//   ssr: false,
// });
interface DailogProps {
  open: boolean;
  title: string;
  onCancel: any;
  onOk: any;
  mask?: boolean;
}
const Dailog = (props: DailogProps) => {
  const { open, mask = false } = props;

  return (
    <div>
      <ModalPro
        title={''}
        open={open}
        centered
        // width={650}
        width="auto"
        destroyOnClose={true}
        onCancel={props.onCancel}
        wrapClassName={styles.modalPro}
        getContainer=".cascade_con"
        footer={false}
        mask={mask}
      >
        <div className="flex flex-col items-center p-[40px_60px]">
          <div className="flex-1 text-[25px] text-[#231f20] text-center mt-[40px]  font-[500] line-clamp-1">
            {props.title}
          </div>

          <div className="mt-[40px] flex items-center justify-center text-[20px]">
            <div
              className="rounded-[50px] p-[15px_30px] bg-[#fff] text-[#231f20] cursor-pointer "
              onClick={props.onCancel}
            >
              Cancel
            </div>
            <div
              className="rounded-[50px] p-[15px_30px] ml-[20px] bg-[#393939] text-[#fff]  font-[600] cursor-pointer "
              onClick={props.onOk}
            >
              Yes
            </div>
          </div>
        </div>
      </ModalPro>
    </div>
  );
};
export default memo(Dailog);
