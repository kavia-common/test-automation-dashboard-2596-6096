import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

// PUBLIC_INTERFACE
export default function Reports() {
  /** Generate Report page: simulate progress, logs, summary and allow export JSON. */
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | completed | cancelled
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const timerRef = useRef(null);
  const logBoxRef = useRef(null);

  const appendLog = (line) => {
    setLogs((l) => [...l, `[${new Date().toLocaleTimeString()}] ${line}`]);
  };

  const simulateSummary = () => {
    // produce consistent pseudo-random totals
    const total = Math.floor(Math.random() * 40) + 10;
    const pass = Math.floor(total * (0.6 + Math.random() * 0.3));
    const remaining = total - pass;
    const fail = Math.max(0, Math.floor(remaining * (0.6 + Math.random() * 0.3)));
    const error = Math.max(0, total - pass - fail);
    return { total, pass, fail, error, generatedAt: new Date().toISOString(), sample: [{ id: "TC-001", status: "pass" }, { id: "TC-002", status: "fail" }] };
  };

  const start = () => {
    if (status === "running") return;
    setProgress(0);
    setLogs([]);
    setSummary(null);
    setStatus("running");
    appendLog("Starting report generation...");
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const inc = Math.max(3, Math.round(Math.random() * 15));
        const next = Math.min(p + inc, 100);
        appendLog(`Progress advanced to ${next}%`);
        return next;
      });
    }, 450);
  };

  const cancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStatus("cancelled");
    appendLog("Generation cancelled by user.");
    toast.error("Report generation cancelled");
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(0);
    setLogs([]);
    setSummary(null);
    setStatus("idle");
  };

  useEffect(() => {
    if (status === "running" && progress >= 100) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setStatus("completed");
      const s = simulateSummary();
      setSummary(s);
      appendLog("Report generated successfully.");
      toast.success("Report generated");
    }
  }, [progress, status]);

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const statusText = useMemo(() => {
    switch (status) {
      case "running":
        return `Generating... ${progress}%`;
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Idle";
    }
  }, [status, progress]);

  const exportJSON = () => {
    if (!summary) return;
    const data = { summary, logs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `report-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  return (
    <Card>
      <CardHeader>Generate Report</CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Button onClick={start} disabled={status === "running"}>
              {status === "running" ? "Generating..." : "Generate Report"}
            </Button>
            <Button variant="ghost" onClick={cancel} disabled={status !== "running"}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={reset} disabled={status === "running" && progress < 100}>
              Reset
            </Button>
            <Button variant="ghost" onClick={exportJSON} disabled={!summary}>
              Export
            </Button>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 h-3 rounded" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="bg-primary h-3 rounded transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-sm text-gray-700">{statusText}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generation Logs</label>
            <textarea
              readOnly
              rows={10}
              value={logs.join("\n")}
              className="w-full font-mono text-xs bg-gray-50"
              aria-label="Generate Report logs"
              ref={logBoxRef}
              style={{ whiteSpace: "pre", overflow: "auto" }}
            />
          </div>

          {summary && (
            <div className="mt-2">
              {/* Horizontal stat bar: mobile 1x1, tablet 2x2, desktop 1x4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Total */}
                <div className="card p-3 border-l-4 border-primary">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Total Cases</div>
                    <span className="h-2 w-2 rounded-full bg-primary/80" aria-hidden />
                  </div>
                  <div className="mt-1 text-2xl font-bold text-text">{summary.total}</div>
                </div>
                {/* Pass */}
                <div className="card p-3 border-l-4 border-success">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Pass</div>
                    <span className="h-2 w-2 rounded-full bg-success/80" aria-hidden />
                  </div>
                  <div className="mt-1 text-2xl font-bold text-success">{summary.pass}</div>
                </div>
                {/* Fail */}
                <div className="card p-3 border-l-4 border-error">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Fail</div>
                    <span className="h-2 w-2 rounded-full bg-error/80" aria-hidden />
                  </div>
                  <div className="mt-1 text-2xl font-bold text-error">{summary.fail}</div>
                </div>
                {/* Error */}
                <div className="card p-3 border-l-4 border-secondary">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Error</div>
                    <span className="h-2 w-2 rounded-full bg-secondary/80" aria-hidden />
                  </div>
                  <div className="mt-1 text-2xl font-bold text-secondary">{summary.error}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Generated at: {new Date(summary.generatedAt).toLocaleString()}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Client-side simulation. Corporate Navy theme with responsive summary grid.
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
