import { Image } from "@/components/kit";
import { memo, useCallback } from "react";
import { ChannelAvatar } from "./ChannelAvatar";

export const GiveawayAvatar = memo(({
  avatars,
  isMini,
}: {
  avatars?: { title?: string; avatar_url: string }[];
  isMini?: boolean;
}) => {
  // const fallback = "/gateway_gift.png";

  const getSize = useCallback(() => {
    if (isMini) {
      switch (avatars?.length) {
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
  }, [avatars, isMini]);

  const Fallback = ({ title }: { title?: string }) => {
    if (title) return <ChannelAvatar title={title} size={getSize()} />;

    return "/gateway_gift.png";
  };

  const GiveawayImage = ({
    avatar_url,
    title,
  }: {
    avatar_url: string;
    title?: string;
  }) => {
    console.log(avatar_url, title);
    return (
      <Image
        src={avatar_url}
        fallback={<Fallback title={title} />}
        size={getSize()}
      />
    );
  };

  if (isMini && avatars && avatars?.length > 1) {
    if (avatars?.length === 2) {
      return (
        <div className="relative flex h-10 w-10">
          <div className="border-section-bg absolute -top-[3px] -left-[3px] overflow-hidden rounded-full border-[3px]">
            <GiveawayImage
              avatar_url={avatars[0].avatar_url}
              title={avatars[0].title}
            />
          </div>
          <div className="border-section-bg absolute -right-[3px] -bottom-[3px] overflow-hidden rounded-full border-[3px]">
            <GiveawayImage
              avatar_url={avatars[1].avatar_url}
              title={avatars[1].title}
            />
          </div>
        </div>
      );
    } else if (avatars?.length >= 3) {
      return (
        <div className="relative flex h-10 w-10">
          <div className="border-section-bg absolute -top-[3px] -left-[3px] overflow-hidden rounded-full border-[3px]">
            <GiveawayImage
              avatar_url={avatars[0].avatar_url}
              title={avatars[0].title}
            />
          </div>
          <div className="border-section-bg absolute -top-[3px] -right-[3px] overflow-hidden rounded-full border-[3px]">
            <GiveawayImage
              avatar_url={avatars[1].avatar_url}
              title={avatars[1].title}
            />
          </div>
          <div className="absolute -bottom-[3px] flex w-full justify-center">
            <div className="border-section-bg overflow-hidden rounded-full border-[3px]">
              <GiveawayImage
                avatar_url={avatars[2].avatar_url}
                title={avatars[2].title}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center -space-x-10">
      <div className="relative overflow-hidden rounded-full">
        <GiveawayImage
          avatar_url={avatars?.[0]?.avatar_url || ""}
          title={avatars?.[0]?.title}
        />
      </div>
    </div>
  );
});

GiveawayAvatar.displayName = "GiveawayAvatar";
