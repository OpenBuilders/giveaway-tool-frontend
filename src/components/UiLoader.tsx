import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.slice";
import { LoaderIcon } from "@/assets/icons/LoaderIcon";
import { Text } from "@/components/kit/Text/Text";

const Loader = () => (
  <div className="flex gap-1">
    <svg
      className="h-5 w-5 animate-spin text-inherit"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    {/* <span>Loading...</span> */}
  </div>
);

export const UiLoader = ({ children }: { children: React.ReactNode }) => {
  const { updateUser, status, user } = useUserStore();
  const [showLoader, setShowLoader] = useState(!user);
  const [renderModal, setRenderModal] = useState(!user);

  const modalClassName =
    "fixed z-[99999999] top-0 left-0 w-screen h-screen flex justify-center items-center";

  // trigger user-load
  useEffect(() => {
    if (!user && status === "idle") {
      updateUser();
    }
  }, [user, status, updateUser]);

  // after 1s, start fading out
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // once fade-out completes (300ms), remove from DOM
  useEffect(() => {
    if (!showLoader) {
      const t = setTimeout(() => {
        setRenderModal(false);
      }, 300); // match the transition duration
      return () => clearTimeout(t);
    }
  }, [showLoader]);

  // error state: show loader indefinitely
  if (status === "error") {
    return (
      <div
        className={
          modalClassName + " flex-col"
        }
      >
        <div className="mb-6 h-[120px] w-[120px]">
          <LoaderIcon />
        </div>
        <Text type="title2" align="center">
          InitData expired please restart app
        </Text>
      </div>
    );
  }

  // while loading (or no user yet), render the modal with opacity transitioning
  if ((status === "idle" || status === "loading" || !user) && renderModal) {
    return (
      <div
        className={`
          ${modalClassName}
          transition-opacity duration-300 text-text-overlay
          ${showLoader ? "opacity-100" : "opacity-0"}
        `}
      >
        <Loader />
      </div>
    );
  }

  // once loader is gone, render app
  return <>{children}</>;
};
