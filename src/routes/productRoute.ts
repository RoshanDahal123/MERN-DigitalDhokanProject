import express, { Router } from "express";
import productController from "../controllers/productController";
import userMiddleware, { Role } from "../middleware/userMiddleware";

import { multer, storage } from "../middleware/multerMiddleware";
import errorHandler from "../services/errorHandler";
const upload = multer({ storage: storage });
const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("productImageUrl"),
    errorHandler(productController.createProduct)
  )
  .get(errorHandler(productController.getAllProducts));

router
  .route("/:id")
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct)
  )
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.updateProduct)
  )
  .get(errorHandler(productController.getSingleProduct));
export default router;
