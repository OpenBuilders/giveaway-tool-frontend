import { useEffect, useContext } from "react";
import { ThemeContext } from "@context";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages";
import GiveawaySetUpPage from "./pages/giveaway/setup/page";
import PrizePage from "./pages/giveaway/setup/prize";
import RequirementPage from "./pages/giveaway/setup/requirement";
import GiveawayPage from "./pages/giveaway/[id]";
import { usePlatform } from "./hooks/usePlatform";
import { UiLoader } from "./components/UiLoader";

function App() {
  const { darkTheme } = useContext(ThemeContext);
  const { isMobile } = usePlatform();
  const webApp = window?.Telegram?.WebApp;

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkTheme ? "dark" : "light",
      // "light"
    );

    if (darkTheme) {
      webApp?.setHeaderColor("#1c1c1e");
      webApp?.setBackgroundColor("#1c1c1e");
      webApp?.setBottomBarColor("#1c1c1e");
    } else {
      webApp?.setHeaderColor("#EFEFF4");
      webApp?.setBackgroundColor("#EFEFF4");
      webApp?.setBottomBarColor("#EFEFF4");
    }
  }, [darkTheme]);

  useEffect(() => {
    webApp.disableVerticalSwipes();
    try {
      webApp.requestWriteAccess();
    } catch (error) {
      console.error("Failed to request write access:", error);
    }
  }, [webApp]);

  useEffect(() => {
    if (isMobile && webApp) {
      try {
        webApp.requestFullscreen();
      } catch (error) {
        console.error("Failed to request fullscreen:", error);
      }
    }
  }, [isMobile, webApp]);

  return (
    <UiLoader>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<MainPage />} />

          <Route path="giveaway">
            <Route path=":id">
              <Route index element={<GiveawayPage />} />
            </Route>

            <Route path="setup">
              <Route index element={<GiveawaySetUpPage />} />

              <Route path="prize" element={<PrizePage />} />
              <Route path="prize/:id" element={<PrizePage />} />
              <Route path="requirement" element={<RequirementPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UiLoader>
  );
}

export default App;
