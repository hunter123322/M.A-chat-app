export type UserAut = {
    user_id?: number;
    username: string;
    password: string;
}

export type UserInfo = {
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
}

export type UserLocation = {
  country: string;
  region: string;
  district: string;
  municipality: string;
  barangay: string;
  zone: string;
  house_number: string;
}