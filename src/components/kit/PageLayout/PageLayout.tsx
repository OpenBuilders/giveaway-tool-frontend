import cn from "classnames";

import styles from "./PageLayout.module.scss";
import { ConnectWalletButton } from "@/components/ui/buttons/ConnectWalletButton";
import { usePlatform } from "@/hooks/usePlatform";

interface PageLayoutProps {
  children: React.ReactNode;
  center?: boolean;
}

export const PageLayout = ({ children, center = false }: PageLayoutProps) => {
  const { isMobile } = usePlatform();

  return (
    <div className={cn(styles.root, center && styles.center)}>
      {children}
      {isMobile && (
        <div className={styles.walletBlock}>
          <div>
            <ConnectWalletButton />
          </div>
        </div>
      )}
    </div>
  );
};
