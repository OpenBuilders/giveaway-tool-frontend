import { memo } from "react";
import connectWalletIcon from "@/assets/icons/requirements/ConnectWalletIcon.png";

export const ConnectWalletIcon = memo(() => (
  <img src={connectWalletIcon} alt="Connect Wallet" width={40} height={40} />
));
