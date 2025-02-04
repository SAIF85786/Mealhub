import React from "react";
import { Button, Container, Row, Stack } from "react-bootstrap";
import "./Management.css";

export default function Management() {
  return (
    <div className="managementpage">
      <div className="section">
        <Stack direction="horizontal">
          <h4>Chef's</h4>
          <Button className="ms-auto btn btn-primary">
            <i class="bi bi-plus"></i>
            Add
          </Button>
        </Stack>
        <div className="list"></div>
      </div>

      <div className="section">
        <Stack direction="horizontal">
          <h4>Waiter's</h4>
          <Button className="ms-auto btn btn-primary">
            <i class="bi bi-plus"></i>Add
          </Button>
        </Stack>
        <div className="list"></div>
      </div>
    </div>
  );
}
