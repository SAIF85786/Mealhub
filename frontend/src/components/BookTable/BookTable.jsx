import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./BookTable.css";
import { updateReservedTables } from "../../store/slices/userSlice";
const MealHubBackend = import.meta.env.VITE_BACKEND_SERVER;

export default function BookTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, email, phone, reservedTables } = useSelector(
    (state) => state.user
  );
  const token = useSelector((state) => state.user.authtoken);
  const now = new Date();
  if (now.getHours() >= 23 && now.getMinutes() > 0) {
    now.setDate(now.getDate() + 1);
  }
  const [formData, setFormData] = useState({
    name,
    email,
    phone,
    date: now,
    time: "19:00",
    guests: 2,
  });

  const isLogin = useSelector((state) => state.user.isLogin);

  const createBooking = async (bookingData) => {
    try {
      const response = await fetch(`${MealHubBackend}/api/customer/bookTable`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const { message, booking } = await response.json();
      if (response.ok) {
        alert("Booking Created successfully");
      }
      return booking;
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time
    const selectedDate = formData.date;
    const [hours, minutes] = formData.time.split(":").map(Number); // Extract hours and minutes

    // Set the hours and minutes to the selected date
    selectedDate.setHours(hours, minutes, 0, 0);
    if (selectedDate < new Date()) {
      alert("Invalid Booking time");
      return;
    }
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
    // alert("Booking Submitted! (Replace this with API call)");
    const data = await createBooking(bookingData);
    let arr = [...reservedTables, data];
    arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    dispatch(updateReservedTables(arr));
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/auth/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${MealHubBackend}/api/customer/bookings/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log(data);
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        dispatch(updateReservedTables(data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchBookings();
  }, [isLogin]);

  if (!isLogin) return;
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
      <div className="container-booking">
        <h3>Your Bookings</h3>
        {reservedTables.length === 0 && <p>No Bookings yet 😞</p>}
        {reservedTables.map((booking) => (
          <div key={booking._id} className="card">
            <div className="card-row">
              <span className="label">📅 Date:</span>
              <span className="value">
                {new Date(booking.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="card-row">
              <span className="label">⌚ Time:</span>
              <span className="value">
                {new Date(booking.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="card-row">
              <span className="label">👥 Guests:</span>
              <span className="value">{booking.guests}</span>
            </div>
            <div className="card-row">
              <span className="label">🍽️ Table No:</span>
              <span className="value">{booking.tableNo}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
