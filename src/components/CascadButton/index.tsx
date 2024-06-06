import clsx from 'clsx';
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';

const ButtonTypes = ['outlined', 'filled'];
type ButtonType = (typeof ButtonTypes)[number];

interface CascadButtonProps {
  icon?: ReactNode;
  title: string;
  /**
   * 按钮 填充类型
   */
  type?: ButtonType;
  color?: string;
  /**
   * 图标大小
   */
  size?: number;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  onClick?: MouseEventHandler | undefined;
}

const CascadButton = (props: CascadButtonProps) => {
  const {
    icon,
    title,
    color = '#393939',
    type = 'outlined',
    size,
    iconClassName = '',
    className = '',
    titleClassName = '',
    onClick,
  } = props;

  const [isFilled, seIsFilled] = useState(false);

  useEffect(() => {
    if (type === 'filled') {
      //   setBackground(color);

      seIsFilled(true);
    } else {
      seIsFilled(false);
    }
  }, [type]);

  return (
    <div
      className={clsx(
        className,
        'flex items-center justify-center rounded-[50px] cursor-pointer'
      )}
      style={{
        borderColor: color,
        borderWidth: isFilled ? '0px' : '1px',
        background: isFilled ? color : 'none',
        padding: isFilled ? '8px 15px' : '10px 20px',
      }}
      onClick={onClick}
    >
      {icon && (
        <div
          className={clsx(
            iconClassName,
            'flex items-center justify-center mr-[10px]'
          )}
          style={{
            width: size ?? 'none',
            height: size ?? 'none',
          }}
        >
          {icon}
        </div>
      )}
      <div
        className={clsx(
          titleClassName,
          'text-[#393939] text-[16px] font-[500] text-center '
        )}
        style={{ color: isFilled ? '#fff' : color }}
      >
        {title}
      </div>
    </div>
  );
};
export default CascadButton;
