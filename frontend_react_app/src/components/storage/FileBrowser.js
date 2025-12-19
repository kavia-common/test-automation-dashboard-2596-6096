import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as storage from "../../services/storage/StorageService";
import { Card, CardHeader, CardBody } from "../ui/Card";
import toast from "react-hot-toast";

// PUBLIC_INTERFACE
export default function FileBrowser({ initialPath = "" }) {
  const [path, setPath] = useState(initialPath);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await storage.list(path);
      setItems(res);
    } catch (e) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ensure latest path triggers reload
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const onDrop = async (accepted) => {
    setUploading(true);
    try {
      for (const file of accepted) {
        await storage.upload(file, path, (pct) => setProgress(pct));
        toast.success(`Uploaded ${file.name}`);
      }
      await load();
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const breadcrumbs = [{ name: "root", path: "" }, ...path.split("/").filter(Boolean).map((p, i, arr) => ({
    name: p,
    path: arr.slice(0, i + 1).join("/")
  }))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" aria-label="File breadcrumbs">
            {breadcrumbs.map((b, i) => (
              <span key={b.path || "root"}>
                {i !== 0 && <span className="mx-1 text-gray-400">/</span>}
                <button className="text-primary hover:underline" onClick={() => setPath(b.path)}>{b.name || "root"}</button>
              </span>
            ))}
          </div>
          {uploading && <div className="text-sm text-gray-600">Uploading... {progress}%</div>}
        </div>
      </CardHeader>
      <CardBody>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${isDragActive ? "border-primary bg-blue-50" : "border-gray-300"}`}
          aria-label="Drag and drop area"
        >
          <input {...getInputProps()} />
          <p>Drag & drop files here, or click to select</p>
        </div>

        <div className="mt-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ul className="divide-y divide-gray-100" aria-label="File list">
              {items.map((it) => (
                <li key={it.path} className="py-2 flex items-center justify-between">
                  <div>
                    {it.type === "folder" ? "📁" : "📄"} <button className="hover:underline" onClick={() => it.type === "folder" ? setPath(it.path) : null}>{it.name}</button>
                  </div>
                  <div className="space-x-2">
                    {it.type !== "folder" && (
                      <>
                        <a className="btn btn-ghost" href={it.url} download aria-label={`Download ${it.name}`}>Download</a>
                        <button className="btn btn-ghost" onClick={async () => { await storage.remove(it.path); toast.success("Deleted"); load(); }} aria-label={`Delete ${it.name}`}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
              {items.length === 0 && <li className="py-2 text-gray-500">No items</li>}
            </ul>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
