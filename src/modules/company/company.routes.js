import express from 'express';
import * as uc from './company.controller.js';
import { auth } from '../../middlewares/auth.js';
import expressAsyncHandler from 'express-async-handler';
import { valdationMiddleware } from '../../middlewares/validation.js';
import * as schema from './company.validationSchema.js';

const router = express.Router();

router.post(
  '/createCompany',
  auth,
  valdationMiddleware(schema.createCompanySchema),
  expressAsyncHandler(uc.createCompany)
);
router.put(
  '/updateCompany/:companyId',
  auth,
  valdationMiddleware(schema.updateCompanySchema),
  expressAsyncHandler(uc.updateCompany)
);
router.delete(
  '/deleteCompany/:companyId',
  auth,
  valdationMiddleware(schema.deleteCompanySchema),
  expressAsyncHandler(uc.deleteCompany)
);

router.get(
  '/getAllCompaniesForHR',
  auth,
  expressAsyncHandler(uc.getAllCompaniesForHR)
);

router.get(
  '/getCompanyData/:companyId',
  auth,
  valdationMiddleware(schema.getCompanyDataSchema),
  expressAsyncHandler(uc.getCompanyData)
);
router.get(
  '/searchCompanyByName',
  auth,
  valdationMiddleware(schema.searchCompanyByNameSchema),
  expressAsyncHandler(uc.searchCompanyByName)
);
router.get(
  '/getApplicationsForJobs/:jobId',
  valdationMiddleware(schema.getApplicationsForJobsSchema),
  expressAsyncHandler(uc.getApplicationsForJobs)
);

router.get(
  '/collectTheApplicationAndCreateExcelSheet/:companyId',
  auth,
  valdationMiddleware(schema.collectTheApplicationAndCreateExcelSheetSchema),
  expressAsyncHandler(uc.collectTheApplicationAndCreateExcelSheet)
);

export default router;
