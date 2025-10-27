import { Button } from "./Button";
import {
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import useWallet from "@/hooks/useWallet";
import { Text } from "@/components/kit";

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
            <span>
              {userFriendlyAddress?.substr(0, 2) +
                "..." +
                userFriendlyAddress?.substr(-2)}
            </span>
          );
        } else {
          return (
            <Text type="subheadline1" color="primary" weight="semibold">Disconnect</Text>
          );
        }
      } else {
        return <Text type="subheadline1" color="primary" weight="semibold">Connect Wallet</Text>;
      }
    }
  };

  return (
    <Button
      className={`flex items-center justify-center gap-2.5 !rounded-[30px] !px-2.5 !py-[5px] bg-sheet-background ${className}`}
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
