import React, { useState } from "react";
import { Button, Container, Row, Stack } from "react-bootstrap";
import "./Management.css";
import ChefForm from "./ChefForm";
import WaiterForm from "./WaiterForm";

export default function Management() {
  const [showChefForm, setShowChefForm] = useState(false);
  const handleChefAdd = () => {
    setShowChefForm(true);
  };
  const [showWaiterForm, setShowWaiterForm] = useState(false);
  const handleWaiterAdd = () => {
    setShowWaiterForm(true);
  };
  return (
    <>
      <ChefForm
        show={showChefForm}
        handleClose={() => setShowChefForm(false)}
      />
      <WaiterForm
        show={showWaiterForm}
        handleClose={() => setShowWaiterForm(false)}
      />
      <div className="managementpage">
        <div className="section">
          <Stack direction="horizontal">
            <h4>Chef's</h4>
            <Button className="ms-auto btn btn-primary" onClick={handleChefAdd}>
              <i className="bi bi-plus"></i>
              Add
            </Button>
          </Stack>
          <div className="list"></div>
        </div>

        <div className="section">
          <Stack direction="horizontal">
            <h4>Waiter's</h4>
            <Button
              className="ms-auto btn btn-primary"
              onClick={handleWaiterAdd}
            >
              <i className="bi bi-plus"></i>Add
            </Button>
          </Stack>
          <div className="list"></div>
        </div>
      </div>
    </>
  );
}
