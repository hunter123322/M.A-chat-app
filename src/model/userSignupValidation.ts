import mongoose from "mongoose";

interface UserAut {
  username: string;
  password: string;
}
interface UserInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
}
interface UserLocation {
  country: string;
  region: string;
  district: string;
  municipality: string;
  barangay: string;
  zone: string;
  house_number: string;
}

function userValidation(userInfoData: UserInfo) {
  if (
    typeof userInfoData.firstName !== "string" ||
    typeof userInfoData.lastName !== "string" ||
    typeof userInfoData.middleName !== "string" ||
    typeof userInfoData.age !== "number"
  )
    throw new Error("Your Input is Invalid!");
  return true;
}

function locationValidation(userLocationData: UserLocation) {
  if (
    typeof userLocationData.country !== "string" ||
    typeof userLocationData.region !== "string" ||
    typeof userLocationData.district !== "string" ||
    typeof userLocationData.municipality !== "string" ||
    typeof userLocationData.barangay !== "string" ||
    typeof userLocationData.zone !== "string" ||
    typeof userLocationData.house_number !== "string"
  )
    throw new Error("Your Input is Invalid!");
  return true;
}

export default { userValidation, locationValidation };
