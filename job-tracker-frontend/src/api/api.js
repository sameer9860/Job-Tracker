import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/accounts/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const requestPasswordReset = (email) =>
  API.post("password-reset-request/", { email });

export const verifyOTP = (email, otp_code) =>
  API.post("otp-verify/", { email, otp_code });

export const setNewPassword = (
  email,
  otp_code,
  new_password1,
  new_password2
) =>
  API.post("set-new-password/", {
    email,
    otp_code,
    new_password1,
    new_password2,
  });

export default API;
