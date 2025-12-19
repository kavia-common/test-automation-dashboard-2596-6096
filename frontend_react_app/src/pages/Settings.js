import React, { useMemo, useState } from "react";
import { getConfig } from "../config";
import { Card, CardHeader, CardBody } from "../components/ui/Card";

export default function Settings() {
  const cfg = useMemo(() => getConfig(), []);
  const [mockMode, setMockMode] = useState(cfg.mockMode);
  const [experiments, setExperiments] = useState(cfg.experiments);
  const [flags] = useState(cfg.flags);

  return (
    <Card>
      <CardHeader>Settings</CardHeader>
      <CardBody>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="mr-2">Mock Mode (auto when Firebase/Backend missing)</label>
              <input type="checkbox" checked={mockMode} onChange={e=>setMockMode(e.target.checked)} aria-label="Mock mode toggle" />
            </div>
            <div>
              <label className="mr-2">Experiments Enabled</label>
              <input type="checkbox" checked={experiments} onChange={e=>setExperiments(e.target.checked)} aria-label="Experiments toggle" />
            </div>
            <div>
              <label>Feature Flags</label>
              <div className="mt-1">
                {flags.length ? flags.join(", ") : <span className="text-gray-500">No flags</span>}
              </div>
            </div>
          </div>
          <div className="overflow-auto max-h-80 border rounded p-2 bg-gray-50 text-xs">
            <pre>{JSON.stringify(cfg, null, 2)}</pre>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
