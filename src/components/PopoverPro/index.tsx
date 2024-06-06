import { Popover, PopoverProps } from 'antd';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import styles from './index.module.less';
import { themeObj } from 'src/recoil/theme';
import { useRecoilState } from 'recoil';
interface PopoverProProps extends PopoverProps {
  items: {
    text: string | ReactNode;
  }[];
}

const PopoverPro = (props: PopoverProProps) => {
  const { className, items, ...rest } = props;
  const [theme, setTheme] = useState('light');
  const [themeRecoil] = useRecoilState(themeObj); // recoil
  useEffect(() => {
    if (!themeRecoil.default) {
      const theme1 = themeRecoil.theme;
      setTheme(theme1);
    }
  }, [themeRecoil]);
  return (
    <Popover
      id={'cascade-' + theme}
      overlayClassName={clsx(styles.overlay, className)}
      content={
        <div className="w-[150px] p-1 text-center text-first">
          {items.map((item, index) => (
            <div
              className="h-10 rounded-[10px] cursor-pointer hover:bg-bg-third/40 duration-300"
              key={index}
            >
              {item.text}
            </div>
          ))}
        </div>
      }
      {...rest}
    />
  );
};
export default PopoverPro;
