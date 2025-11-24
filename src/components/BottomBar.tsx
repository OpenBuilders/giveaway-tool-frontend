import { useEffect, useRef } from 'react';

export const BottomBar = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomBarRef.current) {
      const height = bottomBarRef.current.offsetHeight;
      document.documentElement.style.setProperty('--bottom-bar-height', `${height}px`);
    }
  }, [children]);

  return (
    <div
      ref={bottomBarRef}
      className={`relative bottom-0 left-0 right-0 bg-bg px-4 py-4 pb-9 border-top-button ${className}`}
    >
      {children}
    </div>
  );
};
