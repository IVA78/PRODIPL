import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import InstructionScreen from "./components/InstructionScreen";
import EvaluationScreen from "./components/EvaluationScreen";
import SummaryScreen from "./components/SummaryScreen";
import AdminDashboard from "./components/AdminDashboard";
import PauseScreen from "./components/PauseScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/instructions" element={<InstructionScreen />} />
        <Route path="/evaluation" element={<EvaluationScreen />} />
        <Route path="/summary" element={<SummaryScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="pause" element={<PauseScreen></PauseScreen>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
