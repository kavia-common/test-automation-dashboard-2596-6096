import React, { useEffect, useState } from "react";
import { getConfig } from "../config";

export default function HealthStatus() {
  const cfg = getConfig();
  const [status, setStatus] = useState({ app: "ok", backend: "unknown" });

  useEffect(() => {
    const check = async () => {
      if (cfg.REACT_APP_BACKEND_URL && cfg.REACT_APP_HEALTHCHECK_PATH) {
        try {
          const res = await fetch(`${cfg.REACT_APP_BACKEND_URL}${cfg.REACT_APP_HEALTHCHECK_PATH}`);
          setStatus(s => ({ ...s, backend: res.ok ? "ok" : "error" }));
        } catch {
          setStatus(s => ({ ...s, backend: "error" }));
        }
      } else if (cfg.REACT_APP_BACKEND_URL) {
        try {
          const res = await fetch(`${cfg.REACT_APP_BACKEND_URL}/health`);
          setStatus(s => ({ ...s, backend: res.ok ? "ok" : "error" }));
        } catch {
          setStatus(s => ({ ...s, backend: "error" }));
        }
      } else {
        setStatus(s => ({ ...s, backend: "mock" }));
      }
    };
    check();
  }, [cfg]);

  const badge = (state) => {
    const map = { ok: "bg-green-100 text-success", error: "bg-red-100 text-error", mock: "bg-amber-100 text-secondary", unknown: "bg-gray-100 text-gray-600" };
    return <span className={`px-2 py-0.5 rounded text-xs ${map[state] || map.unknown}`}>{state}</span>;
  };

  return (
    <div className="space-y-2">
      <div>App: {badge(status.app)}</div>
      <div>Backend: {badge(status.backend)}</div>
      <div className="text-xs text-gray-600">
        Node Env: {cfg.REACT_APP_NODE_ENV}, Log Level: {cfg.REACT_APP_LOG_LEVEL}
      </div>
    </div>
  );
}
