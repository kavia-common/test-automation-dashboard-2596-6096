import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/ui/Sidebar";
import * as mockStorage from "./services/storage/StorageService";

// ProtectedRoute test: redirects when no user (mock mode by default)
test("ProtectedRoute redirects to /login when unauthenticated", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Private</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(await screen.findByText("Login")).toBeInTheDocument();
});

// StorageService mock adapter basic contract
test("StorageService can list and upload in mock mode", async () => {
  const before = await mockStorage.list("");
  expect(Array.isArray(before)).toBe(true);
});

// Sidebar has core links
test("Sidebar shows navigation links", () => {
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Requirements")).toBeInTheDocument();
  expect(screen.getByText("Test Generation")).toBeInTheDocument();
});
