import { Image } from "@/components/kit";
import { useCallback } from "react";

export const GiveawayAvatar = ({
  avatarUrls,
  isMini,
}: {
  avatarUrls?: (string | undefined)[];
  isMini?: boolean;
}) => {
  const fallback = "/gateway_gift.png";

  const getSize = useCallback(() => {
    if (isMini) {
      switch (avatarUrls?.length) {
        case 1:
          return 40;
        case 2:
          return 28;
        case 3:
          return 24;
        default:
          return 24;
      }
    }

    return 112;
  }, [avatarUrls, isMini]);

  if (isMini && avatarUrls && avatarUrls?.length > 1) {
    if (avatarUrls?.length === 2) {
      return (
        <div className="relative flex h-10 w-10">
          <div className="border-section-bg absolute -top-[3px] -left-[3px] overflow-hidden rounded-full border-[3px]">
            <Image src={avatarUrls[0] || fallback} size={getSize()} />
          </div>
          <div className="border-section-bg absolute -right-[3px] -bottom-[3px] overflow-hidden rounded-full border-[3px]">
            <Image src={avatarUrls[1] || fallback} size={getSize()} />
          </div>
        </div>
      );
    } else if (avatarUrls?.length === 3) {
      return (
        <div className="relative flex h-10 w-10">
          <div className="border-section-bg absolute -top-[3px] -left-[3px] overflow-hidden rounded-full border-[3px]">
            <Image src={avatarUrls[0] || fallback} size={getSize()} />
          </div>
          <div className="border-section-bg absolute -top-[3px] -right-[3px] overflow-hidden rounded-full border-[3px]">
            <Image src={avatarUrls[1] || fallback} size={getSize()} />
          </div>
          <div className="absolute -bottom-[3px] flex w-full justify-center">
            <div className="border-section-bg overflow-hidden rounded-full border-[3px]">
              <Image src={avatarUrls[2] || fallback} size={getSize()} />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center -space-x-10">
      {avatarUrls?.map((url, index) => (
        <div
          key={index}
          className="border-bg relative overflow-hidden rounded-full border-[3px]"
        >
          <Image src={url ?? fallback} size={getSize()} />
        </div>
      ))}
    </div>
  );
};
