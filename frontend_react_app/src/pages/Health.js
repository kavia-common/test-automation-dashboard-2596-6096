import React from "react";
import HealthStatus from "../components/HealthStatus";
import { Card, CardBody, CardHeader } from "../components/ui/Card";

export default function Health() {
  return (
    <Card>
      <CardHeader>Health</CardHeader>
      <CardBody>
        <HealthStatus />
      </CardBody>
    </Card>
  );
}
