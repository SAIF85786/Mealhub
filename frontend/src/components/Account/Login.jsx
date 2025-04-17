import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { resetMessage, signInUser } from "../../store/slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { isPending, message, role } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signInUser(formData));
  };

  useEffect(() => {
    dispatch(resetMessage());
  }, []);

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">{role} Login</h2>

          {message && <p className="text-danger text-center">{message}</p>}

          <Form onSubmit={handleSubmit}>
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

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </Form>

          {(role === "Customer" || role === "Manager") && (
            <p className="text-center mt-3">
              New {role}? <Link to="/auth/signup">Sign up here</Link>
            </p>
          )}
        </Col>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <motion.img
            layoutId="authimage"
            width="100%"
            src="/assets/images/signin.webp"
            alt="Signin"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
