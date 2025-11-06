export const ChannelAvatar = ({
  title,
  avatar_url,
  className,
  size,
}: {
  username?: string;
  title?: string;
  avatar_url?: string;
  className?: string;
  size?: number;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-full h-10 w-10`}
      style={{
        width: size,
        height: size,
      }}
    >
      {avatar_url && (
        <img
          src={avatar_url}
          className="absolute top-0 left-0 z-10 h-full w-full object-cover"
          alt={title}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div
        style={{
          background: `linear-gradient(#FF845E,#D45246)`,
          fontSize: size ? `${size / 2.5}px` : undefined,
        }}
        className={`absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-full font-bold text-white ${className}`}
      >
        {title?.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};
