import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages";
import GiveawaySetUpPage from "./pages/giveaway/setup/page";
import PrizePage from "./pages/giveaway/setup/prize/[id]";
import Providers from "./components/Providers";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<MainPage />} />

          <Route path="giveaway">
            <Route path="setup">
              <Route index element={<GiveawaySetUpPage />} />

              <Route path="prize">
                <Route path=":id" element={<PrizePage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Providers>
);
