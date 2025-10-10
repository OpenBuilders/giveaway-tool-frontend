import { ReactNode } from "react";

import { Block } from "../Block";
import { Button } from "../Button";
import { Sheet } from "../Sheet";
import { Text } from "../Text";
import styles from "./DialogSheet.module.scss";
import { TelegramMainButton } from "../TelegramMainButton";

interface DialogSheetProps {
  opened: boolean;
  onClose(): void;
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryText?: string;
  onPrimaryClick?: () => void;
  secondaryText?: string;
  onSecondaryClick?: () => void;
}

export function DialogSheet({
  opened,
  onClose,
  icon,
  title,
  description,
  primaryText = "Understood",
  onPrimaryClick,
}: DialogSheetProps) {
  return (
    <>
      {opened && (
        <TelegramMainButton
          text={primaryText}
          onClick={() => {
            onPrimaryClick?.();
          }}
        />
      )}
      <Sheet opened={opened} onClose={onClose}>
        <div className={styles.container}>
          {icon ? <div className={styles.headerIcon}>{icon}</div> : null}

          <Text
            type="title1"
            weight="bold"
            align="center"
            className={styles.title}
          >
            {title}
          </Text>

          {description ? (
            <Text
              type="caption"
              color="secondary"
              align="center"
              className={styles.description}
            >
              {description}
            </Text>
          ) : null}
        </div>
      </Sheet>
    </>
  );
}
