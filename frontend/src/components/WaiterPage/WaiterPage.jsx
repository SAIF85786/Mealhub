import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./WaiterPage.css";
import "../Order/Order.css";
import { Button } from "react-bootstrap";

export default function WaiterPage() {
  const [readyOrders, setReadyOrders] = useState([]);
  const MealHubBackend = import.meta.env.VITE_BACKEND_SERVER;
  const { role, isLogin } = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.authtoken);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "Waiter") {
      navigate("/");
      return;
    }
    if (!isLogin) {
      navigate("/auth/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${MealHubBackend}/api/waiters/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setReadyOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [role, isLogin]);

  const handleBtnClick = async (orderId) => {
    try {
      const response = await fetch(
        `${MealHubBackend}/api/waiters/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      setReadyOrders(readyOrders.filter((value) => value._id !== orderId));
    } catch (error) {
      console.log(error);
    }
  };

  if (role !== "Waiter" || !isLogin) return null;
  return (
    <div className="waiterpage">
      <div className="section">
        <h4>Ready to Serve</h4>
        {readyOrders.length === 0 && <p>No orders are ready yet 😒</p>}
        <div className="list">
          {readyOrders.map((order) => (
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
                  Served
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
