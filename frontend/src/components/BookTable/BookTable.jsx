import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function BookTable() {
  const navigate = useNavigate();
  const { name, email, phone } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name,
    email,
    phone,
    date: new Date(),
    time: "19:00",
    guests: 2,
  });

  const isLogin = useSelector((state) => state.user.isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time
    const selectedDate = formData.date;
    const [hours, minutes] = formData.time.split(":").map(Number); // Extract hours and minutes

    // Set the hours and minutes to the selected date
    selectedDate.setHours(hours, minutes, 0, 0);

    // Convert to ISO format for MongoDB
    const bookingDateTime = selectedDate.toISOString();

    console.log("Booking Date & Time (ISO):", bookingDateTime);

    // Example: Store this bookingDateTime in MongoDB
    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: formData.guests,
      dateTime: bookingDateTime, // Store as a single DateTime field
    };

    console.log("Booking Data:", bookingData);
    alert("Booking Submitted! (Replace this with API call)");
  };

  useEffect(() => {
    if (!isLogin) {
      alert("login first");
      navigate("/auth/login");
    }
  }, []);

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
