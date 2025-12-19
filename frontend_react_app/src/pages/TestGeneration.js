import React, { useState } from "react";
import { getConfig } from "../config";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const cfg = getConfig();

export default function TestGeneration() {
  const [platform, setPlatform] = useState("web");
  const [framework, setFramework] = useState("jest");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
          <div className="flex items-end">
            <Button onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate"}</Button>
          </div>
        </div>
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
