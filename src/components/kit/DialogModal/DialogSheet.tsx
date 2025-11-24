import { ReactNode } from "react";

import { Sheet } from "../Sheet";
import { Text } from "../Text";
import styles from "./DialogSheet.module.scss";
import { Button } from "../Button";
import { Block } from "../Block";

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
      <Sheet opened={opened} onClose={onClose}>
        <div className={styles.container}>
          {icon ? <div className={styles.headerIcon + " [&>svg]:w-full [&>svg]:h-full"}>{icon}</div> : null}

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

          <Block margin="top" marginValue={28}>
              <Button type="primary" onClick={onPrimaryClick ?? onClose}>
                {primaryText}
              </Button>
          </Block>
        </div>
      </Sheet>
    </>
  );
}
