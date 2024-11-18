import sendResponse from "./sendResponse";
import { Response } from "express";
const checkOtpExpiration = (
  res: Response,
  otpGeneratedTime: string,
  thresholdTime: number
) => {
  const currentTime = Date.now();

  if (currentTime - parseInt(otpGeneratedTime) <= thresholdTime) {
    //otp is not expired
    sendResponse(res, 200, "Valid OTP,now you can proceed to reset password🙂");
  } else {
    //otp expires
    sendResponse(res, 403, "OTP expired,Sorry try again later!!😭😭");
  }
};
export default checkOtpExpiration;
