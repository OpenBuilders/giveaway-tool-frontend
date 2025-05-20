export const BottomBar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative bottom-0 left-0 right-0 bg-bg px-4 py-4 pb-9 border-top-button">
      {children}
    </div>
  );
};
