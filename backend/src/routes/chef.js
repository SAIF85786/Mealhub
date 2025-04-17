import express from "express";
import User from "../schema/UserSchema.js";
import Order from "../schema/OrderSchema.js";
import { verifyToken } from "../middleware.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const chefs = await User.find({ role: "Chef" });
    return res.status(200).json(chefs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// get all orders a chef can see.
router.get("/orders", verifyToken, async (req, res) => {
  try {
    // check if the user is chef.
    const user = await User.findOne({ _id: req.userId });
    if (!user || user.role !== "Chef") throw new Error();

    const placedOrders = await Order.find({ orderStatus: "Placed" });
    const preparingOrders = await Order.find({ orderStatus: "Preparing" });
    return res.status(200).json([placedOrders, preparingOrders]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// This will update an order state.
router.get("/order/:id", verifyToken, async (req, res) => {
  try {
    // check if the user is chef.
    const user = await User.findOne({ _id: req.userId });
    if (!user || user.role !== "Chef") throw new Error();

    const orderId = req.params.id;
    const order = await Order.findOne({
      _id: orderId,
      orderStatus: { $in: ["Placed", "Preparing"] },
    });
    if (!order) throw new Error();

    if (order.orderStatus === "Placed") {
      await Order.findByIdAndUpdate(orderId, { orderStatus: "Preparing" });
    } else {
      await Order.findByIdAndUpdate(orderId, { orderStatus: "Ready" });
    }
    return res.status(200).json({ message: `#${orderId} updated succesfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
