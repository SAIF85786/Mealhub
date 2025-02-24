import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  ListGroup,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { addToCart, removeFromCart } from "../../store/slices/orderSlice";
import { menu } from "../../store/menu";

export default function MyCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.order.cart);

  // Get only selected items from the menu
  const selectedItems = menu.menu.filter((item) => cartItems[item._id]);

  // Calculate the bill
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.price * cartItems[item._id],
    0
  );
  const CGST_RATE = 0.05; // 5%
  const SGST_RATE = 0.05; // 5%
  const cgst = subtotal * CGST_RATE;
  const sgst = subtotal * SGST_RATE;
  const totalBill = subtotal + cgst + sgst;

  return (
    <Container className="mt-4">
      <h3 className=" mb-4">My Cart</h3>

      {selectedItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <ListGroup variant="flush">
            {selectedItems.map((item) => (
              <ListGroup.Item
                key={item._id}
                className="d-flex align-items-center"
              >
                <Row className="w-100">
                  {/* Image */}
                  <Col xs={3} sm={2}>
                    <Card.Img
                      src={`assets/images/fooditem/${item.image}`}
                      alt={item.name}
                      className="img-fluid"
                      style={{ maxHeight: "60px", objectFit: "cover" }}
                    />
                  </Col>

                  {/* Item Details */}
                  <Col
                    xs={6}
                    sm={5}
                    className="d-flex justify-content-center flex-column"
                  >
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="mb-0">
                      <strong>
                        ₹{item.price} x {cartItems[item._id]}
                      </strong>{" "}
                      = ₹{item.price * cartItems[item._id]}
                    </p>
                  </Col>

                  {/* Quantity Controls */}
                  <Col xs={3} sm={3} className="d-flex align-items-center">
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
                      value={cartItems[item._id]}
                      readOnly
                      style={{ width: "50px", paddingLeft: "5px" }}
                    />
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => dispatch(addToCart(item._id))}
                    >
                      +
                    </Button>
                  </Col>

                  {/* Remove Button */}
                  <Col
                    xs={12}
                    sm={2}
                    className="text-end d-flex align-items-center"
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        dispatch(
                          removeFromCart({ itemId: item._id, removeAll: true })
                        )
                      }
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Bill Summary */}
          <ListGroup className="mt-4">
            <ListGroup.Item>
              <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>CGST (5%):</strong> ₹{cgst.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>SGST (5%):</strong> ₹{sgst.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Total Bill:</strong> ₹{totalBill.toFixed(2)}
            </ListGroup.Item>
          </ListGroup>

          {/* Place Order Button */}
          <div className="text-center mt-4">
            <Button variant="success" size="lg">
              Place Order (₹{totalBill.toFixed(2)})
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
