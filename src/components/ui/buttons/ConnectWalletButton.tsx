import { Button } from "./Button";
import {
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import useWallet from "@/hooks/useWallet";

export const ConnectWalletButton = ({
  className = "",
  isHeader = false,
}: {
  className?: string;
  isHeader?: boolean;
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const connectionRestored = useIsConnectionRestored();

  const { connectWallet } = useWallet();

  const ButtonText = () => {
    if (!connectionRestored) {
      return <span>Connecting...</span>;
    } else {
      if (userFriendlyAddress) {
        if (isHeader) {
          return (
            <span className="text-gray-200">
              {userFriendlyAddress?.substr(0, 2) +
                "..." +
                userFriendlyAddress?.substr(-2)}
            </span>
          );
        } else {
          return (
            <div className="text-destructive_text flex items-center justify-center gap-4">
              <span>Disconnect</span>
            </div>
          );
        }
      } else {
        return <span>Connect wallet</span>;
      }
    }
  };

  const bgColor = () => {
    if (userFriendlyAddress) {
      if (isHeader) return "bg-plain_bg";
      return "bg-destructive_bg/15";
    } else {
      return "bg-button";
    }
  };

  return (
    <Button
      className={`flex items-center justify-center gap-2.5 !rounded-3xl px-3 py-2 text-[15px] leading-5 font-medium ${bgColor()} ${className}`}
      onClick={() => {
        if (!connectionRestored || !userFriendlyAddress) {
          connectWallet();
        } else {
          tonConnectUI.disconnect();
        }
      }}
      disabled={!connectionRestored}
    >
      <ButtonText />
    </Button>
  );
};
