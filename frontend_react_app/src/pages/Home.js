import React from "react";
import FileBrowser from "../components/storage/FileBrowser";
import { Card, CardBody } from "../components/ui/Card";

export default function Home() {
  return (
    <div className="space-y-4">
      <Card>
        <CardBody>
          <h1 className="text-xl font-semibold text-text">Welcome</h1>
          <p className="text-gray-600">Use the sidebar to navigate requirements, test generation, execution, and reports.</p>
        </CardBody>
      </Card>
      <FileBrowser />
    </div>
  );
}
