import React from "react";
import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: "white", color: "#111827", border: "1px solid #e5e7eb" },
        success: { iconTheme: { primary: "#059669", secondary: "white" } },
        error: { iconTheme: { primary: "#DC2626", secondary: "white" } }
      }}
    />
  );
}
