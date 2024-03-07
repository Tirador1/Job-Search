import Joi from "joi";

export const createCompanySchema = Joi.object({
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.number().min(11).required(),
    companyEmail: Joi.string().email().required(),
    companyHR: Joi.string().required(),
  }),
});

export const updateCompanySchema = Joi.object({
  body: Joi.object({
    companyName: Joi.string().optional(),
    description: Joi.string().optional(),
    industry: Joi.string().optional(),
    address: Joi.string().optional(),
    numberOfEmployees: Joi.number().min(11).optional(),
    companyEmail: Joi.string().email().optional(),
  }),
});

export const deleteCompanySchema = Joi.object({
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
});

export const getCompanySchema = Joi.object({
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
});

export const getCompanyDataSchema = Joi.object({
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
});

export const searchCompanyByNameSchema = Joi.object({
  params: Joi.object({
    companyName: Joi.string().required(),
  }),
});

export const getApplicationsForJobsSchema = Joi.object({
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
});

export const collectTheApplicationAndCreateExcelSheetSchema = Joi.object({
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
});
