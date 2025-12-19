import React, { useState } from "react";
import { getConfig } from "../config";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import * as storage from "../services/storage/StorageService";

const cfg = getConfig();

export default function TestGeneration() {
  const [platform, setPlatform] = useState("web");
  const [framework, setFramework] = useState("jest");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Pre-condition UI state
  const DEFAULT_PATH = "test-assets";
  const [showPre, setShowPre] = useState(false);
  const [precondText, setPrecondText] = useState("");
  const [precondFileName, setPrecondFileName] = useState("preconditions.txt");
  const [preBusy, setPreBusy] = useState(false);

  const fullPrecondPath = `${DEFAULT_PATH}/${precondFileName}`.replace(/^\/+/, "");

  const mockGenerate = () => ({
    cases: [
      { id: "TC-001", title: "User can login", steps: ["Open login","Enter creds","Click submit","See dashboard"] },
      { id: "TC-002", title: "User can logout", steps: ["Click profile","Click logout","See login page"] }
    ],
    code: `describe("Auth",()=>{ test("login",()=>{/* ... */}); });`
  });

  const generate = async () => {
    setLoading(true);
    try {
      if (cfg.REACT_APP_BACKEND_URL) {
        const res = await fetch(`${cfg.REACT_APP_BACKEND_URL}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, framework })
        });
        const data = await res.json();
        setResult(data);
      } else {
        setResult(mockGenerate());
      }
      toast.success("Generation complete");
    } catch (e) {
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // Load preconditions from storage if the file exists
  const loadPreconditions = async () => {
    setPreBusy(true);
    try {
      // Try to find the file under DEFAULT_PATH
      const items = await storage.list(DEFAULT_PATH);
      const existing = items.find((i) => i.type !== "folder" && i.name === precondFileName);
      if (!existing) {
        toast.error("No preconditions file found");
        setPreBusy(false);
        return;
      }
      // Download and read the text
      const { url } = await storage.download(existing.path);
      const resp = await fetch(url);
      const text = await resp.text();
      setPrecondText(text);
      toast.success("Preconditions loaded");
    } catch (e) {
      toast.error("Failed to load preconditions");
    } finally {
      setPreBusy(false);
    }
  };

  // Save/overwrite preconditions to storage
  const savePreconditions = async () => {
    if (!precondFileName || !precondFileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }
    setPreBusy(true);
    try {
      const blob = new Blob([precondText || ""], { type: "text/plain" });
      const file = new File([blob], precondFileName, { type: "text/plain" });
      const res = await storage.upload(file, DEFAULT_PATH);
      if (res?.path) {
        toast.success("Preconditions saved");
      } else {
        toast.success("Saved");
      }
      setShowPre(false);
    } catch (e) {
      toast.error("Failed to save preconditions");
    } finally {
      setPreBusy(false);
    }
  };

  const cancelPreconditions = () => {
    // Do not clear text to allow user to re-open and continue editing if they click again
    setShowPre(false);
  };

  return (
    <Card>
      <CardHeader>Test Generation</CardHeader>
      <CardBody>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label>Platform</label>
            <select className="w-full mt-1" value={platform} onChange={e=>setPlatform(e.target.value)}>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="api">API</option>
            </select>
          </div>
          <div>
            <label>Framework</label>
            <select className="w-full mt-1" value={framework} onChange={e=>setFramework(e.target.value)}>
              <option value="jest">Jest</option>
              <option value="cypress">Cypress</option>
              <option value="playwright">Playwright</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate"}</Button>
            <Button variant="secondary" onClick={() => setShowPre((s) => !s)} aria-label="Open preconditions">
              Pre-Condition
            </Button>
          </div>
        </div>

        {showPre && (
          <div className="mt-4 card p-3">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div className="flex-1">
                <label className="block">File name</label>
                <input
                  className="w-full mt-1"
                  value={precondFileName}
                  onChange={(e) => setPrecondFileName(e.target.value)}
                  placeholder="preconditions.txt"
                  aria-label="Preconditions filename"
                />
                <div className="text-xs text-gray-500 mt-1">Path: {fullPrecondPath}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={loadPreconditions} disabled={preBusy} aria-label="Load preconditions">
                  {preBusy ? "Loading..." : "Load"}
                </Button>
                <Button onClick={savePreconditions} disabled={preBusy} aria-label="Save preconditions">
                  {preBusy ? "Saving..." : "Save"}
                </Button>
                <Button variant="ghost" onClick={cancelPreconditions} aria-label="Cancel editing preconditions">
                  Cancel
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <label className="block">Pre-conditions</label>
              <textarea
                className="w-full mt-1"
                rows={8}
                value={precondText}
                onChange={(e) => setPrecondText(e.target.value)}
                placeholder="Describe any setup steps, data seeding, environment state, or prerequisite conditions before running generated tests..."
                aria-label="Preconditions input"
              />
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="card p-3">
              <h3 className="font-semibold mb-2">Test Cases</h3>
              <ul className="list-disc list-inside text-sm">
                {result.cases?.map(c => <li key={c.id}><strong>{c.id}</strong> - {c.title}</li>)}
              </ul>
            </div>
            <div className="card p-3">
              <h3 className="font-semibold mb-2">Code Snippet</h3>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto"><code>{result.code}</code></pre>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
