export const ChannelAvatar = ({
  title,
  avatar_url,
  className,
}: {
  username?: string;
  title?: string;
  avatar_url?: string;
  className?: string;
}) => {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      {avatar_url && (
        <img
          src={avatar_url}
          className="absolute top-0 left-0 z-10 h-full w-full object-cover"
        />
      )}

      <div
        style={{
          background: `linear-gradient(#FF845E,#D45246)`,
        }}
        className={`absolute top-0 left-0 flex h-full w-full items-center justify-center font-bold rounded-full text-white ${className}`}
      >
        {title?.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};
