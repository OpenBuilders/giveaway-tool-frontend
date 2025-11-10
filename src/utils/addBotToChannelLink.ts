import { goTo } from "./goTo";

export const addBotToChannelLink = () => {
  const addBotLink = `https://t.me/${
    import.meta.env.VITE_BOT_USERNAME
  }?startchannel=&admin=restrict_members+invite_users+post_messages`;

  goTo(addBotLink);
};
