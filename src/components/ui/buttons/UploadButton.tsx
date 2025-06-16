import React, { useRef, useState } from "react";

export interface FilePayload {
  file: File;
  name: string;
  url: string;
}

interface UploadButtonProps {
  allowedFileTypes: string;
  onSuccess: (file: FilePayload) => void;
  onError: (err: Error) => void;
  isLoading?: boolean;
  label?: string;
  className?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  allowedFileTypes,
  onSuccess,
  onError,
  isLoading,
  label = "Upload file",
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (!file) throw new Error("No file selected");

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const allowed = allowedFileTypes
        .replace(/\s+/g, "")
        .split(",")
        .map((s) => s.replace(".", "").toLowerCase());

      if (!allowed.includes(ext)) throw new Error("Invalid file type");

      onSuccess({
        file,
        name: file.name,
        url: `https://t.me/c/${URL.createObjectURL(file)}`,
      });
    } catch (err) {
      if (err instanceof Error) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`text-accent-text cursor-pointer w-full text-left ${className}`}
        disabled={loading || isLoading}
        onClick={() => inputRef.current?.click()}
      >
        {loading || isLoading ? "Uploading…" : label}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={allowedFileTypes}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};
