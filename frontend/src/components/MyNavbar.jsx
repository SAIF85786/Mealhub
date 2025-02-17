import React from "react";
import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function MyNavbar() {
  const { isLogin, name } = useSelector((state) => state.user);

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
        <Nav.Link href="#" onClick={() => navigate("/order")}>
          Order
        </Nav.Link>
        <Nav.Link href="#" onClick={() => navigate("/menu")}>
          Menu
        </Nav.Link>
      </Nav>
      {isLogin ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="d-flex align-items-center"
        >
          <span className="fw-bold me-3">{name}</span>
          <div
            className="d-flex justify-content-center align-items-center rounded-circle bg-dark text-white"
            style={{
              width: "40px",
              height: "40px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/profile")} // Redirect to profile page
          >
            {name.charAt(0).toUpperCase()} {/* First letter of name */}
          </div>
        </motion.div>
      ) : (
        <>
          <Button variant="outline-dark" onClick={() => navigate("auth/login")}>
            Sign In
          </Button>
          <Button
            variant="dark"
            style={{ marginLeft: 5 }}
            onClick={() => navigate("auth/signup")}
          >
            Sign Up
          </Button>
        </>
      )}
    </Navbar>
  );
}
