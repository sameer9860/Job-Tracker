import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Kanban from "./pages/Kanban";
import ChangePassword from "./pages/settings/ChangePassword";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
<Route path="/change-password" element={<ChangePassword />} />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
