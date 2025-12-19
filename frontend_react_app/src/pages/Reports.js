import React, { useEffect, useState } from "react";
import * as storage from "../services/storage/StorageService";
import { Card, CardHeader, CardBody } from "../components/ui/Card";

export default function Reports() {
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const res = await storage.list("reports");
      setItems(res.filter(x => x.type !== "folder"));
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader>Reports</CardHeader>
      <CardBody>
        <ul className="divide-y divide-gray-100">
          {items.map(it => (
            <li key={it.path} className="py-2 flex items-center justify-between">
              <span>{it.name}</span>
              <a className="btn btn-ghost" href={it.url} download>Download</a>
            </li>
          ))}
          {items.length === 0 && <li className="py-2 text-gray-500">No reports</li>}
        </ul>
      </CardBody>
    </Card>
  );
}
