import express from "express";
import Order from "../schema/OrderSchema.js";
import User from "../schema/UserSchema.js";
import { verifyToken } from "../middleware.js";
import ReservedTable from "../schema/ReservedTableSchema.js";

const router = express.Router();

router.get("/id", verifyToken, async (req, res) => {
  try {
    const customerId = req.userId;
    res.status(200).json({ id: customerId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/createOrder", async (req, res) => {
  try {
    const {
      customer,
      items,
      totalAmount,
      paymentMethod,
      deliveryType,
      orderStatus,
    } = req.body;
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
      orderStatus,
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

router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId })
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

router.post("/bookTable", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, guests, dateTime } = req.body;
    if (!name || !email || !phone || !guests || !dateTime) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if cusomter is valid
    const user = await User.findOne({ _id: req.userId, role: "Customer" });
    if (!user) {
      console.log("user not found");
      return res.status(400).json({ message: "Customer not found" });
    }

    const booking = new ReservedTable({
      contactDetails: { name, email, phone },
      guests,
      date: dateTime,
    });
    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/bookings", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId, role: "Customer" });
    if (!user) throw new Error();

    const bookings = await ReservedTable.find({
      "contactDetails.email": user.email,
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
