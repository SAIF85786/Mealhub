import React, { useEffect, useState } from "react";
import "./OrdersList.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MealHubBackend = import.meta.env.VITE_BACKEND_SERVER;
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.authtoken);

  useEffect(() => {
    if (!token) navigate("/auth/login");
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${MealHubBackend}/api/customer/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Format date function
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get the appropriate status class
  const getStatusClass = (status) => {
    const statusMap = {
      Placed: "status-placed",
      Preparing: "status-preparing",
      Ready: "status-ready",
      Completed: "status-completed",
      Cancelled: "status-cancelled",
    };

    return statusMap[status];
  };

  // Calculate total price for an order item
  const calculateItemTotal = (item) => {
    return (item.quantity * item.price).toFixed(2);
  };

  if (loading || !token)
    return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (orders.length === 0)
    return <div className="no-orders">You haven't placed any orders yet.</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="order-card">
            <div className="order-header">
              <span className="order-id">
                Order #{order._id.substring(order._id.length - 8)}
              </span>
              {order.createdAt && (
                <span className="order-date">
                  {formatDate(order.createdAt)}
                </span>
              )}
              <span
                className={`order-status ${getStatusClass(order.orderStatus)}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="order-details">
              <div className="detail-item">
                <span className="detail-label">Payment Method</span>
                <span className="detail-value">{order.paymentMethod}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Order Date</span>
                <span className="detail-value">
                  {new Date(order.orderDate).toDateString() || "Not specified"}
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
                    <span className="item-price">
                      ₹{calculateItemTotal(item)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-section">
              <span className="total-amount">
                Total: ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersList;
