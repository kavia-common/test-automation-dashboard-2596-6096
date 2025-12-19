import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as storage from "../services/storage/StorageService";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function Requirements() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const onDrop = async (accepted) => {
    try {
      for (const f of accepted) {
        await storage.upload(f, "requirements");
      }
      toast.success("Files attached");
    } catch {
      toast.error("Attachment failed");
    }
  };
  const dz = useDropzone({ onDrop });

  const save = async () => {
    setSaving(true);
    try {
      const blob = new Blob([text], { type: "text/plain" });
      const file = new File([blob], `requirements-${Date.now()}.txt`, { type: "text/plain" });
      await storage.upload(file, "requirements");
      toast.success("Requirements saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>Requirements</CardHeader>
      <CardBody>
        <div className="space-y-3">
          <textarea aria-label="Requirements input" value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full" placeholder="Paste or write requirements here..." />
          <div {...dz.getRootProps()} className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${dz.isDragActive ? "border-primary bg-blue-50" : "border-gray-300"}`} aria-label="Attach files area">
            <input {...dz.getInputProps()} />
            <p>Attach related documents (drag & drop or click)</p>
          </div>
          <div>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Requirements"}</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
