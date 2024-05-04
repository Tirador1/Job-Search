import express from "express";
import * as uc from "./user.controller.js";
import { auth } from "../../middlewares/auth.js";
import expressAsyncHandler from "express-async-handler";
import { valdationMiddleware } from "../../middlewares/validation.js";
import * as schema from "./user.validationSchema.js";

const router = express.Router();

router.post(
  "/signUp",
  valdationMiddleware(schema.signUpSchema),
  expressAsyncHandler(uc.signUp)
);
router.post("/signIn", valdationMiddleware(schema.signInSchema), uc.signIn);
router.put(
  "/updateAccount",
  auth,
  valdationMiddleware(schema.updateAccountSchema),
  expressAsyncHandler(uc.updateAccount)
);
router.delete(
  "/deleteAccount",
  valdationMiddleware(schema.deleteAccountSchema),
  auth,
  expressAsyncHandler(uc.deleteAccount)
);
router.get(
  "/getUserAccountData",
  auth,
  expressAsyncHandler(uc.getUserAccountData)
);
router.get(
  "/getProfileData/:userId",
  valdationMiddleware(schema.getProfileDataSchema),
  expressAsyncHandler(uc.getProfileData)
);
router.patch(
  "/updatePassword",
  valdationMiddleware(schema.updatePasswordSchema),
  auth,
  expressAsyncHandler(uc.updatePassword)
);
router.patch(
  "/forgetPassword",
  valdationMiddleware(schema.forgetPasswordSchema),
  expressAsyncHandler(uc.forgetPassword)
);
router.get(
  "/getAccountsByRecoveryEmail",
  valdationMiddleware(schema.getAccountsByRecoveryEmailSchema),
  expressAsyncHandler(uc.getAccountsByRecoveryEmail)
);

export default router;
