import { Route, Routes } from "react-router-dom";

import { GamePage } from "./pages/GamePage";
import { JoinPage } from "./pages/JoinPage";
import { CreatePage } from "./pages/CreatePage";
import { AdminPage } from "./pages/AdminPage";
import { AppStateProvider } from "./providers/AppStateProvider";
import { ErrorModal } from "./components/ErrorModal";

function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route path="/admin/:sessionId" element={<AdminPage />} />

        <Route path="/game/:sessionId" element={<GamePage />} />

        <Route path="/create" element={<CreatePage />} />

        <Route path="/" element={<JoinPage />} />
      </Routes>

      <ErrorModal />
    </AppStateProvider>
  );
}

export default App;
