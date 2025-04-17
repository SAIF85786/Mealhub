import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (only for Customers)
    required: true,
  },
  items: [
    {
      name: { type: String, required: true }, // Item name
      price: { type: Number, required: true }, // Price per item
      quantity: { type: Number, required: true, default: 1 }, // Quantity ordered
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["card", "upi"], // currently Card and UPI are supported
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Placed", "Preparing", "Ready", "Completed", "Cancelled"], // will change later
    default: "Placed",
  },
  assignedChef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Chef preparing the order
  },
  assignedWaiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Waiter serving the order
  },
  orderDate: { type: Date, default: Date.now }, // Order creation timestamp
  deliveryType: {
    type: String,
    enum: ["Dine-in", "Takeaway", "Delivery"], // will change later
    default: "Delivery",
  },
  tableNumber: { type: Number }, // Only for dine-in orders
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
