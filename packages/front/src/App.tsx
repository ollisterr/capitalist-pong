import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { GamePage } from "./pages/GamePage";
import { JoinPage } from "./pages/JoinPage";
import { CreatePage } from "./pages/CreatePage";
import { AdminPage } from "./pages/AdminPage";
import { AppStateProvider } from "./providers/AppStateProvider";
import { ErrorModal } from "./components/ErrorModal";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <Routes>
          <Route path="/admin/:sessionId" element={<AdminPage />} />

          <Route path="/game/:sessionId" element={<GamePage />} />

          <Route path="/create" element={<CreatePage />} />

          <Route path="/" element={<JoinPage />} />
        </Routes>

        <ErrorModal />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
