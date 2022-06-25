import { useState } from "react";

import { GamePage } from "./pages/GamePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { JoinPage } from "./pages/JoinPage";
import { CreatePage } from "./pages/CreatePage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/admin/:sessionId" element={<GamePage />}></Route>

          <Route path="/:sessionId" element={<GamePage />} />

          <Route path="/create" element={<CreatePage />} />

          <Route path="/" element={<JoinPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
