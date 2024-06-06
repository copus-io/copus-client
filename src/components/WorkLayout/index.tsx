import { ReactNode, useEffect, useState } from 'react';
import useUserInfo from 'src/hooks/use-user-info';
import TopBar from '../TopBar';

const WorkLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {}, []);
  const { data: userInfo } = useUserInfo();
  const [family, setFamily] = useState('');
  return (
    <div
      className="h-full flex "
      style={{
        fontFamily: family,
      }}
    >
      <div className="flex  w-full  overflow-hidden relative">
        <div className="flex-1 w-full overflow-hidden  ">
          <div className="flex flex-1  flex-col h-full overflow-x-auto ">
            <div className="top">
              <TopBar />
            </div>
            <div className="flex-1 h-full w-full mx-[auto] overflow-hidden ">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WorkLayout;
