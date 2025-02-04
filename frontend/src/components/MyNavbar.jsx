import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router";

export default function MyNavbar() {
  const navigate = useNavigate();
  return (
    <Navbar
      bg="light"
      data-bs-theme="light"
      style={{ margin: "0px 10px", backgroundColor: "#00000055" }}
    >
      <Navbar.Brand href="/">MealHub</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#" onClick={() => navigate("/")}>
          Home
        </Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>
      </Nav>
      <Button variant="outline-dark">sign in</Button>
      <Button variant="dark" style={{ marginLeft: 5 }}>
        sign up
      </Button>
    </Navbar>
  );
}
