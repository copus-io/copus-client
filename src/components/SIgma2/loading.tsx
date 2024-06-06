import { useEffect, useState } from 'react';

const SigmaLoading = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="w-full h-[100vh] flex justify-center flex-col items-center">
        <div className="w-[270px] h-[16px] bg-[#999] ">
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: '#231f20',
              height: '16px',
            }}
          >
            {/* 进度条 */}
          </div>
        </div>
        <p className="text-first text-[14px] font-[600] mt-[20px]">
          Visualizing the collective creativity {progress}%...
        </p>
      </div>
    </>
  );
};

export default SigmaLoading;
