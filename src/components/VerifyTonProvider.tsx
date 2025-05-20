import { verifyTonProof } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export const VerifyTonProvider = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const verifyTonProofFetch = useMutation({
    mutationFn: (data: {
      proof: any;
      address: any;
      publicKey: any;
      walletStateInit: any;
    }) => {
      return verifyTonProof(data);
    },
    onSuccess({ verify }) {
      if (verify) {
        // openPopup(<BlurredToast title="Wallet connected" />, "success");
      } else {
        // невалидный proof — отключаем кошелёк
        tonConnectUI.disconnect();
        // openPopup(
        //   <BlurredToast
        //     title="Verification failed"
        //     message="Please try again"
        //   />,
        //   "error"
        // );
      }
    },
    onError: (error: any) => {
    //   openPopup(
    //     <BlurredToast
    //       title={error?.response?.data?.message || "Error"}
    //       message={"Failed to verify wallet address"}
    //     />,
    //     "error"
    //   );
      tonConnectUI.disconnect();
    },
    retry: 0,
  });

  useEffect(() => {
    if (
      wallet?.connectItems?.tonProof &&
      "proof" in wallet.connectItems.tonProof
    ) {
      const { proof } = wallet.connectItems.tonProof;

      const address = tonConnectUI.account?.address;
      const publicKey = tonConnectUI.account?.publicKey;
      const walletStateInit = tonConnectUI.account?.walletStateInit;

      verifyTonProofFetch.mutate({
        proof,
        address,
        publicKey,
        walletStateInit,
      });
    }
  }, [wallet?.connectItems?.tonProof, tonConnectUI?.account]);

  return null;
};
