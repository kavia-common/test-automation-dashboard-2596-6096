import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

// PUBLIC_INTERFACE
export default function TestScriptGeneration() {
  /** Page to simulate generating and running a test script with progress and controls. */
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | cancelled | completed
  const timerRef = useRef(null);

  const startRun = () => {
    if (status === "running") return;
    setProgress(0);
    setStatus("running");
    // Simulate run progress from 0->100
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.round(Math.random() * 12 + 6), 100);
        return next;
      });
    }, 400);
  };

  const cancelRun = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStatus("cancelled");
  };

  const resetRun = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(0);
    setStatus("idle");
  };

  useEffect(() => {
    if (status === "running" && progress >= 100) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setStatus("completed");
      toast.success("Test script run completed successfully");
    }
  }, [progress, status]);

  useEffect(() => {
    // Cleanup on unmount
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
      <CardHeader>Generate Test Script</CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Use this tool to generate and run a test script. Click "Run Test Script" to simulate execution progress.
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Button onClick={startRun} disabled={status === "running"}>
              {status === "running" ? "Running..." : "Run Test Script"}
            </Button>
            <Button variant="ghost" onClick={cancelRun} disabled={status !== "running"}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={resetRun} disabled={status === "running" && progress < 100}>
              Reset
            </Button>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-primary h-3 rounded transition-all"
                style={{ width: `${progress}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                role="progressbar"
              />
            </div>
            <div className="text-sm text-gray-700">{statusText()}</div>
          </div>

          <div className="text-xs text-gray-500">
            Corporate Navy theme applied: primary actions in navy, subtle progress styling, accessible controls.
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
