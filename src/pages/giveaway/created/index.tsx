import { BottomBar } from "@/components/BottomBar";
import { Layout } from "@/components/Layout";
import { BackButton } from "@twa-dev/sdk/react";
import { useNavigate } from "react-router";
import WebApp from "@twa-dev/sdk";

export default function GiveawayCreatedPage() {
  const navigate = useNavigate();

  return (
    <>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />

      <Layout title="Giveaway Created!" icon="/congrats.svg" center>
        <div className="flex flex-col gap-6">
          <p className="text-center">
            You can now share it with your community and make changes within the{" "}
            <br />
            next 10 minutes.
          </p>

          <div className="flex justify-between items-center gap-4 px-4 py-[11px] rounded-">
            
          </div>
        </div>
      </Layout>

      <div className="flex flex-col">
        <BottomBar className="flex flex-col gap-2.5">
          <button
            className="w-full bg-button text-white font-medium py-[14px] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              WebApp.shareMessage("test");
            }}
          >
            Share to Channel
          </button>
          <button
            className="w-full bg-second-button text-accent-text font-medium py-[14px] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              navigate("/");
            }}
          >
            Back to Main
          </button>
        </BottomBar>
      </div>
    </>
  );
}
