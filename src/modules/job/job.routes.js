import express from "express";
import * as uc from "./job.controller.js";
import { auth } from "../../middlewares/auth.js";
import expressAsyncHandler from "express-async-handler";
import { valdationMiddleware } from "../../middlewares/validation.js";
import * as schema from "./job.validationSchema.js";

const router = express.Router();

router.post(
  "/addJob",
  auth,
  valdationMiddleware(schema.addJobSchema),
  expressAsyncHandler(uc.addJob)
);

router.put(
  "/updateJob/:jobId",
  auth,
  valdationMiddleware(schema.updateJobSchema),
  expressAsyncHandler(uc.updateJob)
);

router.delete(
  "/deleteJob/:jobId",
  auth,
  valdationMiddleware(schema.deleteJobSchema),
  expressAsyncHandler(uc.deleteJob)
);

router.get(
  "/getAllJobsWithTheirCmpanies",
  auth,
  expressAsyncHandler(uc.getAllJobsWithTheirCompanies)
);

router.get(
  "/getAllJobsForACompany/:companyId",
  auth,
  valdationMiddleware(schema.getAllJobsForACompanySchema),
  expressAsyncHandler(uc.getAllJobsForACompany)
);

router.get(
  "/getAllJobsThatMatchFilter",
  auth,
  valdationMiddleware(schema.getAllJobsThatMatchFilterSchema),
  expressAsyncHandler(uc.getAllJobsThatMatchFilter)
);

router.post(
  "/applyForAJob/:jobId",
  auth,
  valdationMiddleware(schema.applyForAJobSchema),
  expressAsyncHandler(uc.applyForAJob)
);

export default router;
