import cn from "classnames";

import styles from "./Image.module.scss";
import { getColor, getFirstLetter } from "./helpers";
import { useState } from "react";

interface ImageProps {
  fallback?: string | React.ReactNode;
  src?: string | null;
  size: 24 | 28 | 40 | 112;
  borderRadius?: 50 | 12 | 8;
}

export const Image = ({ src, size, borderRadius, fallback }: ImageProps) => {
  const [isError, setIsError] = useState(false);

  if (isError) {
    return fallback;
  }

  if (!src) {
    if (fallback && typeof fallback === "string") {
      const firstLetter = getFirstLetter(fallback);
      const color = getColor();
      return (
        <div
          className={styles.fallback}
          style={{
            background: color,
            minWidth: size,
            minHeight: size,
          }}
        >
          <p
            style={{
              fontSize: `${size / 2}px`,
            }}
            className={styles.fallbackText}
          >
            {firstLetter}
          </p>
        </div>
      );
    }
    return (
      <div
        className={cn(
          styles.emptyImage,
          borderRadius && styles[`border-radius-${borderRadius}`],
        )}
        style={{
          minWidth: size,
          minHeight: size,
        }}
      >
        😔
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt="image"
        width={size}
        height={size}
        className={cn(borderRadius && styles[`border-radius-${borderRadius}`])}
        onError={(e) => {
          if (fallback && typeof fallback === "string") {
            e.currentTarget.src = fallback;
          } else {
            setIsError(true);
          }
        }}
      />
    </>
  );
};
