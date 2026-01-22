import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPasswordEmail from "./pages/ForgotPasswordEmail";
import ForgotPasswordOTP from "./pages/ForgotPasswordOTP";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
        <Route path="/reset-password" element={<ForgotPasswordOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
