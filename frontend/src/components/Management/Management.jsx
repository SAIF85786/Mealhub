import React, { useEffect, useState } from "react";
import { Button, Container, Row, Stack, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "./Management.css";
import ChefForm from "./ChefForm";
import WaiterForm from "./WaiterForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Management() {
  const navigate = useNavigate();
  const [showChefForm, setShowChefForm] = useState(false);
  const [showWaiterForm, setShowWaiterForm] = useState(false);
  const role = useSelector((state) => state.user.role);
  const { chefs, waiters } = useSelector((state) => state.user);

  useEffect(() => {
    if (role !== "Manager") navigate("/");
  }, [role, navigate]);

  if (role !== "Manager") return null;
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
            <h4>Chefs</h4>
            <Button
              className="ms-auto btn btn-primary"
              onClick={() => setShowChefForm(true)}
            >
              <i className="bi bi-plus"></i> Add
            </Button>
          </Stack>
          <div className="list">
            {chefs.map((chef, index) => (
              <motion.div
                key={chef._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="mb-2">
                  <Card.Body>
                    <Card.Title>{chef.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {chef.position}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Email:</strong> {chef.email} <br />
                      <strong>Phone:</strong> {chef.phone} <br />
                      <strong>Experience:</strong> {chef.experience} years{" "}
                      <br />
                      <strong>Specialization:</strong> {chef.specialization}{" "}
                      <br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="section">
          <Stack direction="horizontal">
            <h4>Waiters</h4>
            <Button
              className="ms-auto btn btn-primary"
              onClick={() => setShowWaiterForm(true)}
            >
              <i className="bi bi-plus"></i> Add
            </Button>
          </Stack>
          <div className="list">
            {waiters.map((waiter, index) => (
              <motion.div
                key={waiter._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="mb-2">
                  <Card.Body>
                    <Card.Title>{waiter.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {waiter.position}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Email:</strong> {waiter.email} <br />
                      <strong>Phone:</strong> {waiter.phone} <br />
                      <strong>Experience:</strong> {waiter.experience} years{" "}
                      <br />
                      <strong>Languages:</strong> {waiter.languages.join(", ")}{" "}
                      <br />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
