import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./PaymentPage.css";
import { useDispatch, useSelector } from "react-redux";
import { menu } from "../../store/menu";
import { clearCart } from "../../store/slices/cartSlice";
import SuccessAnimation from "./SuccessAnimation";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { amount } = location.state || {};
  const token = useSelector((state) => state.user.authtoken);
  const cartItems = useSelector((state) => state.cart.cart);

  useEffect(() => {
    if (!token) navigate("/auth/login");
    if (!amount) {
      navigate("/"); // Redirect to home if accessed directly
    }
  }, [amount, navigate]);

  if (!amount) return null; // Prevent rendering before redirect

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'processing' | 'done'
  const [error, setError] = useState("");
  const MealHubBackend = import.meta.env.VITE_BACKEND_SERVER;

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardDetails({ ...cardDetails, number: formatCardNumber(value) });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
  };

  const validateCardDetails = () => {
    if (cardDetails.number.replace(/\s/g, "").length < 16) {
      return "Please enter a valid card number";
    }
    if (!cardDetails.name) {
      return "Please enter the cardholder name";
    }
    if (cardDetails.expiry.length < 5) {
      return "Please enter a valid expiry date (MM/YY)";
    }
    if (cardDetails.cvv.length < 3) {
      return "Please enter a valid CVV";
    }
    return "";
  };

  const validateUpi = () => {
    if (!upiId.includes("@")) {
      return "Please enter a valid UPI ID (e.g., name@upi)";
    }
    return "";
  };

  const handleCancel = () => {
    navigate("/mycart");
  };

  const fetchCustId = async () => {
    try {
      const response = await fetch(`${MealHubBackend}/api/customer/id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }
      return data.id;
    } catch (eror) {
      console.error("Some error occured", error);
    }
  };

  const createOrder = async () => {
    const custId = await fetchCustId();
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

    const Qty = selectedItems.map((val) => [
      val.name,
      val.price,
      cartItems[val._id],
    ]);

    const items = Qty.map((val) => ({
      name: val[0],
      price: val[1],
      quantity: val[2],
    }));
    const orderData = {
      customer: custId, // Replace with actual user ID
      // items: [
      //   { name: "Pizza", price: 10, quantity: 2 },
      //   { name: "Pasta", price: 15, quantity: 1 },
      // ],
      items,
      totalAmount: totalBill,
      paymentMethod: paymentMethod,
      orderStatus: "Placed",
      deliveryType: "Dine-in",
    };

    try {
      const response = await fetch(
        `${MealHubBackend}/api/customer/createOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }
      return { status: "success" };
    } catch (error) {
      console.error("Error creating order:", error);
      return { status: "failed" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate based on payment method
    const validationError =
      paymentMethod === "card" ? validateCardDetails() : validateUpi();

    if (validationError) {
      setError(validationError);
      return;
    }

    // Simulate payment processing
    setPaymentStatus("processing");
    setTimeout(async () => {
      // alert("Payment done successfully now show a done animation");
      // make api call to send the order to database
      try {
        const { status } = await createOrder();
        if (status === "failed") throw new Error();
        setPaymentStatus("done");
        dispatch(clearCart());
        setTimeout(() => navigate("/myorders"), 3000);
      } catch (error) {
        alert("Payment failed");
        setPaymentStatus("idle");
      }
    }, 2000);
  };

  if (paymentStatus === "done") return <SuccessAnimation />;

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2 className="payment-title">Payment Gateway</h2>
        <p className="payment-amount">Amount: ₹{amount}</p>
      </div>

      <div className="tab-container">
        <button
          className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
          onClick={() => setPaymentMethod("card")}
        >
          Credit/Debit Card
        </button>
        <button
          className={`payment-tab ${paymentMethod === "upi" ? "active" : ""}`}
          onClick={() => setPaymentMethod("upi")}
        >
          UPI
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {paymentMethod === "card" ? (
          <>
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardNumberChange}
                className="form-input"
                placeholder="4242 4242 4242 4242"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardInputChange}
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="flex-row">
              <div className="form-group flex-item">
                <label className="form-label">Expiry (MM/YY)</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleExpiryChange}
                  className="form-input"
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  className="form-input cvv-input"
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="form-group">
            <label className="form-label">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={handleUpiChange}
              className="form-input"
              placeholder="yourname@upi"
            />
          </div>
        )}

        <div className="button-container">
          <button
            type="submit"
            disabled={paymentStatus === "processing"}
            className="pay-button"
          >
            {paymentStatus === "processing"
              ? "Processing..."
              : `Pay ₹${amount}`}
          </button>

          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
