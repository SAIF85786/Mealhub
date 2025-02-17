import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["Manager", "Chef", "Waiter", "Customer"],
    required: true,
  },
  position: {
    type: String,
  },
  dob: { type: Date },
  address: { type: String },
  password: { type: String, required: true },
  startDate: { type: Date }, // Applicable for employees (Manager, Chef, Waiter)
  salary: { type: Number }, // Only for employees
  experience: { type: String }, // Only for employees
  specialization: { type: String }, // Only for Chefs
  languages: { type: [String] }, // Only for Waiters
  orderHistory: { type: [mongoose.Schema.Types.ObjectId], ref: "Order" }, // Only for Customers
  reservationHistory: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Reservation",
  }, // Only for Customers
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

const User = mongoose.model("User", userSchema);
export default User;
