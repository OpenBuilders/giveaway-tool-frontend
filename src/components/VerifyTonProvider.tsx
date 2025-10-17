import { verifyTonProof, type VerifyTonProofRequest, type TonProofData } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export const VerifyTonProvider = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const verifyTonProofFetch = useMutation({
    mutationFn: (data: VerifyTonProofRequest) => {
      return verifyTonProof(data);
    },
    onSuccess({ verify }) {
      if (verify) {
        tonConnectUI.disconnect();
      } else {
        tonConnectUI.disconnect();
      }
    },
    onError: () => {
      tonConnectUI.disconnect();
    },
    retry: 0,
  });

  useEffect(() => {
    if (wallet?.connectItems?.tonProof && "proof" in wallet.connectItems.tonProof) {
      const { proof } = wallet.connectItems.tonProof as { proof: TonProofData };

      const address = tonConnectUI.account?.address as string | undefined;
      const chainValue = tonConnectUI.account?.chain as string | number | undefined;

      let network: "-239" | "-1" = "-239";
      if (typeof chainValue === "string") {
        network = chainValue === "mainnet" || chainValue === "ton" ? "-239" : "-1";
      } else if (typeof chainValue === "number") {
        network = chainValue === -239 ? "-239" : "-1";
      }

      if (address) {
        verifyTonProofFetch.mutate({
          proof,
          address,
          network,
        });
      }
    }
  }, [wallet, tonConnectUI.account, verifyTonProofFetch]);

  return null;
};
