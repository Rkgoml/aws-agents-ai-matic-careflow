import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Registry from "./pages/Registry";
import Workflow from "./components/Workflow";
import { Toaster } from "react-hot-toast";
import WorkflowSchedular from "./pages/WorkflowSchedular";
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="workflows" element={<Workflow />} />
          <Route path="registry" element={<Registry />} />
          <Route path="schedular" element={<WorkflowSchedular />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
