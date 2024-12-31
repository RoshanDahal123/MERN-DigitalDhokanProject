import express, { Router } from "express";
import categoryController from "../controllers/categoryController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";

const router: Router = express.Router();

router
  .route("/")
  .get(errorHandler(categoryController.getCategories))
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(categoryController.addCategory)
  );
router
  .route("/:id")
  .patch(
    userMiddleware.accessTo(Role.Admin),
    errorHandler(categoryController.updateCategory)
  )
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(categoryController.deleteCategory)
  );

export default router;
