import { Request, Response } from "express";

const errorHandler = (fn: Function) => {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err: Error) => {
      console.log(err);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
      return;
    });
  };
};
export default errorHandler;
