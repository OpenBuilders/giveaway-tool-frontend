export const profileAccentColors: { [key: number]: string[] } = {
  0: ["#FF5269", "#FF865D"], // Red
  1: ["#FFA95C", "#FFCC68"], // Orange
  2: ["#6862FF", "#83AFFF"], // Purple
  3: ["#56CC69", "#9EDD7D"], // Green
  4: ["#2ACAB8", "#50ECD5"], // Cyan
  5: ["#2BA0F2", "#72D4FD"], // Blue
  6: ["#D66BED", "#E0A1F3"], // Pink
};

export const ChannelAvatar = ({
  title,
  avatar_url,
  className,
  size,
  id,
}: {
  username?: string;
  title?: string;
  avatar_url?: string;
  className?: string;
  size?: number;
  id?: number;
}) => {
  const colorIndex = id ? Math.abs(id) % 7 : 0;
  const [color1, color2] = profileAccentColors[colorIndex];

  return (
    <div
      className={`relative overflow-hidden rounded-full h-8 w-8`}
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
          background: `linear-gradient(${color2}, ${color1})`,
          fontSize: size ? `${size / 2.5}px` : undefined,
        }}
        className={`absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-full font-bold text-white ${className}`}
      >
        {title?.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};
