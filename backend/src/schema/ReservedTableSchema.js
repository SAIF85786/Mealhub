import mongoose from "mongoose";

const ContactDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Fixed typo from "require" to "required"
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ReservedTableSchema = new mongoose.Schema({
  tableNo: {
    type: Number,
    default: () => Math.floor(Math.random() * 21), // Generates a random table number (0-20)
  },
  contactDetails: {
    type: ContactDetailsSchema,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true, // Ensures the date is always provided
    index: {
      expireAfterSeconds: 0,
    },
  },
});

const ReservedTable = mongoose.model("ReservedTable", ReservedTableSchema);
export default ReservedTable;
