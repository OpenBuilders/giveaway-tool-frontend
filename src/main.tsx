import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages";
import GiveawaySetUpPage from "./pages/giveaway/setup/page";
import PrizePage from "./pages/giveaway/setup/prize";
import RequirementPage from "./pages/giveaway/setup/requirement";
import Providers from "./components/Providers";
import GiveawayCreatedPage from "./pages/giveaway/created";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<MainPage />} />

          <Route path="giveaway">
            <Route path="setup">
              <Route index element={<GiveawaySetUpPage />} />

              <Route path="prize" element={<PrizePage />}>
                {/* <Route path=":id" element={<PrizePage />} /> */}
              </Route>

              <Route path="requirement" element={<RequirementPage />}>
                {/* <Route path=":id" element={<PrizePage />} /> */}
              </Route>
            </Route>

            <Route path="created" element={<GiveawayCreatedPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Providers>
);
