import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { GamePage } from "./pages/GamePage";
import { JoinPage } from "./pages/JoinPage";
import { CreatePage } from "./pages/CreatePage";
import { AdminPage } from "./pages/AdminPage";
import { AppStateProvider } from "./providers/AppStateProvider";
import { theme } from "./styles/theme";
import { useErrorHandling } from "./hooks";

function App() {
  useErrorHandling();

  return (
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <Routes>
          <Route path="/admin/:sessionId" element={<AdminPage />} />

          <Route path="/game/:sessionId" element={<GamePage />} />

          <Route path="/create" element={<CreatePage />} />

          <Route path="/" element={<JoinPage />} />
        </Routes>

        <ToastContainer position="bottom-right" pauseOnHover />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
