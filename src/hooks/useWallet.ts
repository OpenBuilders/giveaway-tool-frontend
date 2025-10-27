import { generateTonProofPayload } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback } from "react";

export default function useWallet() {
  const [tonConnectUI] = useTonConnectUI();

  const generateTonProofPayloadFetch = useMutation({
    mutationFn: () => {
      return generateTonProofPayload();
    },
    onSuccess: ({ ton_proof }) => {
      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: { tonProof: ton_proof?.payload },
      });
      tonConnectUI.openModal();
    },
    onError: () => {
      tonConnectUI.disconnect();
    },
    retry: 0,
  });

  const connectWallet = useCallback(() => {
    if (tonConnectUI) {
      generateTonProofPayloadFetch.mutate();
    }
  }, [tonConnectUI]);

  return {
    connectWallet,
  };
}
