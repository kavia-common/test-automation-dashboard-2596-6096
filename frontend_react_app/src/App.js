import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/ui/Header";
import Sidebar from "./components/ui/Sidebar";
import Footer from "./components/ui/Footer";
import Breadcrumbs from "./components/ui/Breadcrumbs";
import AppToaster from "./components/ui/Toaster";

// Pages
import Home from "./pages/Home";
import Requirements from "./pages/Requirements";
import TestGeneration from "./pages/TestGeneration";
import Execute from "./pages/Execute";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Health from "./pages/Health";
import TestScriptGeneration from "./pages/TestScriptGeneration";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";

// PUBLIC_INTERFACE
function App() {
  /** Main application shell and routes. */
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background text-text">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">
              <div className="mx-auto max-w-7xl px-4 py-4">
                <Breadcrumbs />
                <div className="mt-4">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/requirements" element={<Requirements />} />
                      <Route path="/test-generation" element={<TestGeneration />} />
                      <Route path="/execute" element={<Execute />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/health" element={<Health />} />
                      <Route path="/generate-script" element={<TestScriptGeneration />} />
                    </Route>
                  </Routes>
                </div>
              </div>
            </main>
          </div>
          <Footer />
          <AppToaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
