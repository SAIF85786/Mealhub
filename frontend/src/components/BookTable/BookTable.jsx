import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookTable() {
  const [formData, setFormData] = useState({
    user_id: "12345", // Replace with actual user ID
    table_id: "67890", // Replace with available table
    date: new Date(),
    time: "19:00",
    guests: 2,
    contact: { name: "", phone: "", email: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      contact: { ...formData.contact, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Booking Submitted! (Replace this with API call)");
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="align-items-center justify-content-between gap-2">
        {/* Image on the left */}
        <Col md={5} className="text-center">
          <Image
            src="assets/images/table.png"
            alt="Table Booking"
            fluid
            rounded
          />
        </Col>

        {/* Form on the right */}
        <Col md={6}>
          <div className="shadow-lg p-4 bg-white rounded">
            <h2 className="text-center mb-4">Book a Table</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Guests</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="6"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                >
                  {Array.from({ length: 15 }, (_, i) => {
                    const hour = 9 + i; // 9:00 AM to 11:00 PM
                    const formattedHour = hour > 12 ? hour - 12 : hour;
                    const amPm = hour >= 12 ? "PM" : "AM";
                    const timeValue = `${hour.toString().padStart(2, "0")}:00`;
                    return (
                      <option key={timeValue} value={timeValue}>
                        {formattedHour}:00 {amPm}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Book Now
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
