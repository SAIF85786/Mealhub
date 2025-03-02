import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { menu } from "./../../store/menu";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/slices/cartSlice";

const menuItems = menu.menu;

const Menu = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Restaurant Menu</h2>
      <Row>
        {menuItems.map((item) => (
          <Col md={4} sm={6} key={item._id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={"assets/images/fooditem/" + item.image}
                height={200}
                width={400}
                style={{ objectFit: "cover" }}
                alt={item.name}
              />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  <strong>Category:</strong> {item.category} <br />
                  <strong>Price:</strong> ₹{item.price} <br />
                  <strong>Rating:</strong> ⭐{item.rating}
                </Card.Text>

                {cartItems[item._id] ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="d-flex align-items-center"
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => dispatch(removeFromCart(item._id))}
                    >
                      -
                    </Button>
                    <Form.Control
                      className="mx-2 text-center"
                      type="text"
                      min="1"
                      value={cartItems[item._id]}
                      readOnly
                      style={{ width: "70px", paddingLeft: "5px" }}
                    />
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => dispatch(addToCart(item._id))}
                    >
                      +
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => dispatch(addToCart(item._id))}
                    >
                      Add to Cart
                    </Button>
                  </motion.div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Menu;
