import {
  verifyTonProof,
  type VerifyTonProofRequest,
  type TonProofData,
} from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useToast } from "./kit";
import { AxiosError } from "axios";

export const VerifyTonProvider = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { showToast } = useToast();

  const verifyTonProofFetch = useMutation({
    mutationFn: (data: VerifyTonProofRequest) => {
      return verifyTonProof(data);
    },
    onSuccess({ success, error }) {
      if (success) {
        console.log("success");
      } else {
        if (error) {
          showToast({
            message: error,
            type: "error",
            time: 3000,
          });
        }
        tonConnectUI.disconnect();
      }
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errorMessage =
        error.response?.data?.error || "Failed to verify wallet";

      if (errorMessage === "wallet already linked to another account") {
        showToast({
          message: "This wallet is already linked to another account",
          type: "error",
          time: 3000,
        });
      } else {
        showToast({
          message: errorMessage,
          type: "error",
          time: 3000,
        });
      }
      tonConnectUI.disconnect();
    },
    retry: 0,
  });

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
      if (
        wallet?.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        const { proof } = wallet.connectItems.tonProof as {
          proof: TonProofData;
        };

        const address = tonConnectUI.account?.address as string | undefined;
        const chainValue = tonConnectUI.account?.chain as
          | string
          | number
          | undefined;

        let network: "-239" | "-1" = "-239";
        if (isNaN(Number(chainValue))) {
          network =
            chainValue === "mainnet" || chainValue === "ton" ? "-239" : "-1";
        } else if (typeof chainValue === "number") {
          network = chainValue === -239 ? "-239" : "-1";
        } else {
          network = Number(chainValue) === -239 ? "-239" : "-1";
        }

        if (
          address &&
          !verifyTonProofFetch.isPending &&
          !verifyTonProofFetch.isSuccess
        ) {
          verifyTonProofFetch.mutate({
            proof,
            address,
            network,
          });
        }
      }
    });
    return () => {
      unsubscribe?.();
    };
  }, [tonConnectUI, verifyTonProofFetch]);

  return null;
};
