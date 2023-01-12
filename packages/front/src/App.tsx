import { Route, Routes } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { GamePage } from "./pages/GamePage";
import { JoinPage } from "./pages/JoinPage";
import { CreatePage } from "./pages/CreatePage";
import { AdminPage } from "./pages/AdminPage";
import { AppStateProvider } from "./providers/AppStateProvider";
import { theme } from "./styles/theme";
import { useErrorHandling } from "./hooks";
import { useEffect } from "react";
import { socket } from "./config/socket.config";
import { NavBar } from "./components";
import { PageWrapper } from "./styles";

function App() {
  useErrorHandling();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <PageContainer>
          <NavBar />

          <PageWrapper>
            <Routes>
              <Route path="/admin/:sessionId" element={<AdminPage />} />

              <Route path="/game/:sessionId" element={<GamePage />} />

              <Route path="/create" element={<CreatePage />} />

              <Route path="/" element={<JoinPage />} />
            </Routes>
          </PageWrapper>
        </PageContainer>

        <ToastContainer position="bottom-right" pauseOnHover />
      </AppStateProvider>
    </ThemeProvider>
  );
}

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  background-color: ${(p) => p.theme.colors.white};
`;

export default App;
