import { useEffect, useRef } from 'react';

const useIntersectionObserver = (
  elements: (HTMLElement | null)[],
  callback: (id: string) => void,
  options: any
) => {
  const observer = useRef<any>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target.id);
        }
      });
    }, options);

    const { current: currentObserver } = observer;

    elements
      ?.filter(Boolean)
      .forEach((element) => currentObserver.observe(element));

    return () => currentObserver.disconnect();
  }, [elements, callback, options]);
};
export default useIntersectionObserver;
