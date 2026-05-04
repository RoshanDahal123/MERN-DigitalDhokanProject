import { Response } from "express";
const sendResponse = (
  res: Response,
  statusNumber: number,
  message: string,
  data: any = null
) => {
  res.status(statusNumber).json({
    message,
    data: data !== undefined && data !== null ? (Array.isArray(data) ? (data.length > 0 ? data : null) : data) : null,
  });
};
export default sendResponse;
