import Joi from "joi";

export const addJobSchema = Joi.object({
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required(),
    workingTime: Joi.string().required(),
    seniorityLevel: Joi.string().required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
    company: Joi.string().required(),
  }),
});

export const updateJobSchema = Joi.object({
  body: Joi.object({
    jobTitle: Joi.string().optional(),
    jobLocation: Joi.string().optional(),
    workingTime: Joi.string().optional(),
    seniorityLevel: Joi.string().optional(),
    jobDescription: Joi.string().optional(),
    technicalSkills: Joi.array().items(Joi.string()).optional(),
    softSkills: Joi.array().items(Joi.string()).optional(),
  }),
});

export const deleteJobSchema = Joi.object({
  params: Joi.object({
    jobId: Joi.string().required(),
  }),
});

export const getAllJobsForACompanySchema = Joi.object({
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
});

export const getAllJobsThatMatchFilterSchema = Joi.object({
  body: Joi.object({
    jobLocation: Joi.string().optional(),
    workingTime: Joi.string().optional(),
    seniorityLevel: Joi.string().optional(),
    technicalSkills: Joi.array().items(Joi.string()).optional(),
    softSkills: Joi.array().items(Joi.string()).optional(),
  }),
});

export const applyForAJobSchema = Joi.object({
  body: Joi.object({
    jobId: Joi.string().required(),
    userTechSkills: Joi.array().items(Joi.string()).required(),
    userSoftSkills: Joi.array().items(Joi.string()).required(),
    userResume: Joi.string().required(),
  }),
});
