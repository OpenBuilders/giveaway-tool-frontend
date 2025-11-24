import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

/**
 * Component that manages Telegram Main Button visibility when TON Connect modal is open
 */
export const TonConnectMainButtonManager = () => {
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp?.MainButton) return;

    // Subscribe to modal state changes
    const unsubscribe = tonConnectUI.onModalStateChange((state) => {
      if (state.status === "opened") {
        // Hide and disable Main Button when TON Connect modal is opened
        webApp.MainButton.hide();
        webApp.MainButton.disable();
      } else if (state.status === "closed") {
        // Dispatch custom event to notify TelegramMainButton components
        // that they should restore their state
        window.dispatchEvent(new CustomEvent("tonconnect-modal-closed"));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  return null;
};

