import express from "express";
import User from "../schema/UserSchema.js";
import { verifyToken } from "../middleware.js";
import Order from "../schema/OrderSchema.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const waiters = await User.find({ role: "Waiter" });
    return res.status(200).json(waiters);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// get all orders a waiter can see.
router.get("/orders", verifyToken, async (req, res) => {
  try {
    // check if the user is waiter.
    const user = await User.findOne({ _id: req.userId });
    if (!user || user.role !== "Waiter") throw new Error();

    const readyOrders = await Order.find({ orderStatus: "Ready" });
    return res.status(200).json(readyOrders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// This will update an order state.
router.get("/order/:id", verifyToken, async (req, res) => {
  try {
    // check if the user is waiter.
    const user = await User.findOne({ _id: req.userId });
    if (!user || user.role !== "Waiter") throw new Error();

    const orderId = req.params.id;
    const order = await Order.findOne({
      _id: orderId,
      orderStatus: "Ready",
    });
    if (!order) throw new Error();

    await Order.findByIdAndUpdate(orderId, { orderStatus: "Completed" });
    return res.status(200).json({ message: `#${orderId} updated succesfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
