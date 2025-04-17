import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import "./ChefPage.css";
import "../Order/Order.css";

export default function WaiterPage() {
  const [placedOrders, setPlacedOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const MealHubBackend = import.meta.env.VITE_BACKEND_SERVER;

  const { role, isLogin } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.authtoken);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "Chef") {
      navigate("/");
      return;
    }
    if (!isLogin) {
      navigate("/auth/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${MealHubBackend}/api/chefs/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setPlacedOrders(data[0]);
        setPreparingOrders(data[1]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [role, isLogin]);

  const handleBtnClick = async (orderId, orderStatus) => {
    try {
      const response = await fetch(
        `${MealHubBackend}/api/chefs/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      if (orderStatus === "Placed") {
        const order = placedOrders.find((value) => value._id === orderId);
        setPlacedOrders(placedOrders.filter((value) => value._id !== orderId));
        setPreparingOrders([...preparingOrders, order]);
      } else {
        setPreparingOrders(
          preparingOrders.filter((value) => value._id !== orderId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (role !== "Chef" || !isLogin) return null;
  return (
    <div className="chefpage">
      <div className="section">
        <h4>New Orders</h4>
        {placedOrders.length === 0 && <p>No new orders yet 🤗</p>}
        <div className="list">
          {placedOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">
                  Order #{order._id.substring(order._id.length - 8)}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <span className="detail-label">Order Date</span>
                  <span className="detail-value">
                    {new Date(order.orderDate).toDateString() ||
                      "Not specified"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Order Time</span>
                  <span className="detail-value">
                    {new Date(order.orderDate).toLocaleTimeString() ||
                      "Not specified"}
                  </span>
                </div>
              </div>

              <h3 className="items-heading">Order Items</h3>
              <ul className="items-list">
                {order.items.map((item, index) => (
                  <li key={index} className="item-row">
                    <span className="item-name">{item.name}</span>
                    <div>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="total-section">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleBtnClick(order._id, order.orderStatus);
                  }}
                >
                  Start Preparing
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h4>Preparing</h4>
        {preparingOrders.length === 0 && <p>No orders under preparation 😴</p>}
        <div className="list">
          {preparingOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">
                  Order #{order._id.substring(order._id.length - 8)}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <span className="detail-label">Order Date</span>
                  <span className="detail-value">
                    {new Date(order.orderDate).toDateString() ||
                      "Not specified"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Order Time</span>
                  <span className="detail-value">
                    {new Date(order.orderDate).toLocaleTimeString() ||
                      "Not specified"}
                  </span>
                </div>
              </div>

              <h3 className="items-heading">Order Items</h3>
              <ul className="items-list">
                {order.items.map((item, index) => (
                  <li key={index} className="item-row">
                    <span className="item-name">{item.name}</span>
                    <div>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="total-section">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleBtnClick(order._id);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
