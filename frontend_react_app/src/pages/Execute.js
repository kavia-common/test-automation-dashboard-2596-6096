import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

// PUBLIC_INTERFACE
export default function Execute() {
  /** Execute Test Script page: simulate run with progress and stream logs. */
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | cancelled | completed
  const [logs, setLogs] = useState([]);
  const timerRef = useRef(null);
  const logBoxRef = useRef(null);

  const appendLog = (line) => {
    setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ${line}`]);
  };

  const startRun = () => {
    if (status === "running") return;
    setLogs([]);
    setProgress(0);
    setStatus("running");
    appendLog("Starting Execute Script run...");
    // Simulate progress with variable increments
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const inc = Math.max(2, Math.round(Math.random() * 12));
        const next = Math.min(p + inc, 100);
        appendLog(`Progress advanced to ${next}%`);
        return next;
      });
    }, 450);
  };

  const cancelRun = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStatus("cancelled");
    appendLog("Run cancelled by user.");
    toast.error("Execution cancelled");
  };

  const resetRun = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(0);
    setLogs([]);
    setStatus("idle");
  };

  // Auto-complete handling
  useEffect(() => {
    if (status === "running" && progress >= 100) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setStatus("completed");
      appendLog("Execute Script run completed successfully.");
      toast.success("Execute Script completed");
    }
  }, [progress, status]);

  // Auto scroll logs
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const statusText = () => {
    switch (status) {
      case "running":
        return `Running... ${progress}%`;
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Idle";
    }
  };

  return (
    <Card>
      <CardHeader>Execute Test Script</CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Button onClick={startRun} disabled={status === "running"}>
              {status === "running" ? "Running..." : "Run Execute Script"}
            </Button>
            <Button variant="ghost" onClick={cancelRun} disabled={status !== "running"}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={resetRun}
              disabled={status === "running" && progress < 100}
            >
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 h-3 rounded" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div
                className="bg-primary h-3 rounded transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-700">{statusText()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Execution Logs</label>
            <textarea
              readOnly
              rows={10}
              value={logs.join("\n")}
              className="w-full font-mono text-xs bg-gray-50"
              aria-label="Execute Script logs"
              ref={logBoxRef}
              style={{ whiteSpace: "pre", overflow: "auto" }}
            />
          </div>

          <div className="text-xs text-gray-500">
            Uses client-side simulation. Styled with Corporate Navy theme.
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
