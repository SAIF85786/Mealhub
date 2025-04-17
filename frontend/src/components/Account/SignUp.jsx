import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMessage,
  setSignUpUser,
  signUpUser,
} from "../../store/slices/userSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const { message, isPending, isLogin, role } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = {
      ...formData,
      role,
      orderHistory: [],
      reservationHistory: [],
      status: "Active",
    };
    dispatch(
      setSignUpUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role,
        address: formData.address,
      })
    );
    dispatch(signUpUser(user));
  };

  useEffect(() => {
    dispatch(resetMessage());
  }, []);
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <motion.img
            layoutId="authimage"
            width="100%"
            src="/assets/images/signup.webp"
            alt="Signup"
          />
        </Col>

        <Col md={6}>
          <h2 className="text-center">{role} Signup</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isPending}
            >
              {isPending ? <Spinner animation="border" size="sm" /> : "Sign Up"}
            </Button>

            {message && <p className="mt-3 text-center">{message}</p>}
          </Form>
          <p className="text-center mt-3">
            Already signed up? <Link to="/auth/login">Login here</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
