import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import clsx from 'clsx';
import { memo } from 'react';
import seedao4 from 'src/assets/media/png/seedao/seedao00004.png';
import { ReactComponent as FaceIcon } from 'src/assets/media/svg2/ic-face.svg';

interface UserAvatarProps {
  /** 头像大小 */
  size?: number;
  faceSize?: number;
  /** icon大小 */
  iconSize?: number;
  /** 是否是web3 */
  isSeedao?: boolean;
  /** 头像链接 */
  logoUrl?: string;

  canClick?: boolean;
}

const UserAvatar = (props: UserAvatarProps) => {
  const {
    isSeedao = false,
    logoUrl = '',
    size = 40,
    faceSize = 25,
    iconSize = 16,
    canClick = true,
  } = props;
  return (
    <div
      className="relative flex"
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className="rounded-full border overflow-hidden  flex justify-center items-center"
        style={{
          width: size,
          height: size,
        }}
      >
        {logoUrl ? (
          <Avatar
            size={size}
            className={clsx(canClick ?? 'cursor-pointer')}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
            src={logoUrl}
            icon={<UserOutlined />}
          />
        ) : (
          <FaceIcon
            style={{
              width: faceSize,
              height: faceSize,
            }}
            className={clsx(canClick ?? 'cursor-pointer')}
          />
        )}
      </div>

      {isSeedao && (
        <div
          className="absolute right-[-5px] bottom-[0px] rounded-full  overflow-hidden"
          style={{
            width: iconSize,
            height: iconSize,
          }}
        >
          <img
            src={seedao4.src}
            style={{
              width: iconSize,
              height: iconSize,
              objectFit: 'cover',
              background: 'white',
              verticalAlign: 'top',
            }}
          />
        </div>
      )}
    </div>
  );
};
export default memo(UserAvatar);
