import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
    userID: { type: String, require: true },
  },
  { timestamps: true }
);

function userValidation(firstName: string, lastName: string, middleName: string, age: number) {
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof middleName !== "string" ||
    typeof age !== "number"
  )
    throw new Error("Your Input is Invalid!");
  return true;
}

function locationValidation(
  country: string,
  region: string,
  district: string,
  municipality: string,
  barangay: string,
  zone: string,
  house_number: string
) {
  if (
    typeof country !== "string" ||
    typeof region !== "string" ||
    typeof district !== "string" ||
    typeof municipality !== "string" ||
    typeof barangay !== "string" ||
    typeof zone !== "string" ||
    typeof house_number !== "string"
  )
    throw new Error("Your Input is Invalid!");
  return true;
}
export default {locationValidation, userValidation, messageSchema };
