import { Button } from "./Button";
import {
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import useWallet from "@/hooks/useWallet";
import { Text } from "@/components/kit";
import { ConnectWalletIcon } from "@/assets/icons/ConnectWalletIcon";

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
      return (
        <Text type="subheadline1" color="primary" weight="semibold">
          Connecting...
        </Text>
      );
    } else {
      if (userFriendlyAddress) {
        if (isHeader) {
          return (
            <span>
              {userFriendlyAddress?.substr(0, 2) +
                "..." +
                userFriendlyAddress?.substr(-2)}
            </span>
          );
        } else {
          return (
            <Text type="subheadline1" color="primary" weight="semibold">
              Disconnect
            </Text>
          );
        }
      } else {
        return (
          <Text type="subheadline1" color="primary" weight="semibold">
            Connect Wallet
          </Text>
        );
      }
    }
  };

  return (
    <Button
      className={`bg-secondary-full-bg backdrop-blur-sm flex items-center justify-center gap-1 !rounded-[30px] !px-2.5 !py-[5px] ${className}`}
      onClick={() => {
        if (!connectionRestored || !userFriendlyAddress) {
          connectWallet();
        } else {
          tonConnectUI.disconnect();
        }
      }}
      disabled={!connectionRestored}
    >
      <div className="text-text">
        <ConnectWalletIcon isCustomColor />
      </div>
      <ButtonText />
    </Button>
  );
};
