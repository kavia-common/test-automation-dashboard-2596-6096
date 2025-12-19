import React, { useEffect, useRef, useState } from "react";
import { getConfig } from "../config";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const cfg = getConfig();

export default function Execute() {
  const [suite, setSuite] = useState("regression");
  const [env, setEnv] = useState("staging");
  const [queue, setQueue] = useState([]);
  const idRef = useRef(1);

  const startJob = async () => {
    const id = idRef.current++;
    const job = { id, suite, env, status: "queued", progress: 0, logs: [] };
    setQueue(q => [job, ...q]);
    toast.success("Job queued");

    if (cfg.REACT_APP_BACKEND_URL) {
      try {
        await fetch(`${cfg.REACT_APP_BACKEND_URL}/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suite, env })
        });
      } catch {
        toast.error("Backend execution failed; continuing mock");
      }
    }

    // Mock progress
    let i = 0;
    const interval = setInterval(() => {
      i += 10;
      setQueue(q => q.map(j => j.id === id ? {
        ...j,
        status: i >= 100 ? "completed" : "running",
        progress: Math.min(i, 100),
        logs: [...j.logs, `Progress ${i}%`]
      } : j));
      if (i >= 100) {
        clearInterval(interval);
        toast.success("Job completed");
      }
    }, 500);
  };

  useEffect(() => { /* keyboard accessibility */ }, []);

  return (
    <Card>
      <CardHeader>Execute Tests</CardHeader>
      <CardBody>
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label>Suite</label>
            <select className="w-full mt-1" value={suite} onChange={e=>setSuite(e.target.value)}>
              <option value="smoke">Smoke</option>
              <option value="regression">Regression</option>
              <option value="e2e">E2E</option>
            </select>
          </div>
          <div>
            <label>Environment</label>
            <select className="w-full mt-1" value={env} onChange={e=>setEnv(e.target.value)}>
              <option value="dev">Dev</option>
              <option value="staging">Staging</option>
              <option value="prod">Prod</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={startJob}>Start</Button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Execution Queue</h3>
          <ul className="space-y-2" aria-label="Execution queue">
            {queue.map(j => (
              <li key={j.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">#{j.id} - {j.suite} on {j.env}</div>
                  <div className="text-sm">{j.status} - {j.progress}%</div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mt-2">
                  <div className="bg-primary h-2 rounded" style={{ width: `${j.progress}%` }}></div>
                </div>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-2 max-h-32 overflow-auto">{j.logs.join("\n")}</pre>
              </li>
            ))}
            {queue.length === 0 && <li className="text-gray-500">No jobs yet</li>}
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
