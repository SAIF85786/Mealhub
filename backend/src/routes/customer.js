import express from "express";
import Order from "../schema/OrderSchema.js";
import User from "../schema/UserSchema.js";
import { verifyToken } from "../middleware.js";

const router = express.Router();

router.get("/id", verifyToken, async (req, res) => {
  try {
    const customerId = req.customerId;
    res.status(200).json({ id: customerId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/createOrder", async (req, res) => {
  try {
    const { customer, items, totalAmount, paymentMethod, deliveryType } =
      req.body;
    // Validate required fields
    if (
      !customer ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if cusomter is valid
    const user = await User.find({ _id: customer, role: "Customer" });
    if (user.length === 0) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Create new order
    const newOrder = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod,
      deliveryType,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.customerId })
      .populate("customer")
      .sort({ orderDate: -1 });
    if (!orders.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
