import React from "react";
import { useNavigate } from "react-router";
import "./Home.css";
import { Button, Card, Container, Stack } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to MealHub</h1>
        <div>
          Savor the convenience of culinary delight with MealHub – where
          ordering your favorite dishes is as easy as a click, delivering taste
          to your doorstep.
        </div>
        <div>
          Elevate your dining experience; order, savor, enjoy – seamless
          gastronomic delight.
        </div>
      </div>
      <div className="p-3 actual-services">
        <Card onClick={() => navigate("/order")} className="service-card p-2">
          <Card.Img src="assets/icons/add.png"></Card.Img>
          <Card.Body>
            <Card.Title>Order Food</Card.Title>
          </Card.Body>
        </Card>
        <Card
          onClick={() => navigate("book-table")}
          className="service-card p-2"
        >
          <Card.Img src="assets/icons/reservation.png"></Card.Img>
          <Card.Body>
            <Card.Title>Book Table</Card.Title>
          </Card.Body>
        </Card>
        <Card className="service-card p-2">
          <Card.Img src="assets/icons/reservation.png"></Card.Img>
          <Card.Body>
            <Card.Title>Book Table</Card.Title>
          </Card.Body>
        </Card>
        <Card className="service-card p-2">
          <Card.Img src="assets/icons/reservation.png"></Card.Img>
          <Card.Body>
            <Card.Title>Book Table</Card.Title>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
