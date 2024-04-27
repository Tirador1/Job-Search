import Job from '../../../DB/models/job.collection.js';
import Company from '../../../DB/models/company.collection.js';
import Application from '../../../DB/models/application.collection.js';
import moment from 'moment';
import CryptoJS from 'crypto-js';
/**
 * Steps to create a job
 * 1. Check if the user is a company HR
 * 2. Check if the company exists
 * 3. Create a job
 * 4. Return the job data
 */
export const addJob = async (req, res, next) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    salary,
    technicalSkills,
    softSkills,
    company,
  } = req.body;

  const companyName = await Company.findOne({ companyName: company });
  if (!companyName) {
    return next(new Error("Your company doesn't exist", { cause: 404 }));
  }

  if (req.user.role !== 'Company_HR') {
    return next(new Error('You are not allowed to add a job', { cause: 403 }));
  }

  const job = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    salary,
    technicalSkills,
    softSkills,
    addedBy: req.user.id,
    company: companyName._id,
  });

  if (!job) {
    return next(new Error('Job not added', { cause: 500 }));
  }

  res.status(201).json({
    success: true,
    message: 'Job added successfully',
    data: job,
  });
};

/**
 * Steps to update a job
 * 1. Check if the user is a company HR
 * 2. Check if the job exists
 * 3. Update the job
 */
export const updateJob = async (req, res, next) => {
  const { jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return next(new Error('Job not found', { cause: 404 }));
    }

    if (
      req.user.role !== 'Company_HR' ||
      req.user.id.toString() !== job.addedBy.toString()
    ) {
      return next(
        new Error('You are not allowed to update this job', { cause: 403 })
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to delete a job
 * 1. Check if the user is a company HR
 * 2. Check if the job exists
 * 3. Delete the job
 */
export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return next(new Error('Job not found', { cause: 404 }));
    }

    if (
      req.user.role !== 'Company_HR' ||
      req.user.id.toString() !== job.addedBy.toString()
    ) {
      return next(
        new Error('You are not allowed to delete this job', { cause: 403 })
      );
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).populate('company');

    if (!job) {
      return next(new Error('Job not found', { cause: 404 }));
    }

    let decryptedEmail = await CryptoJS.AES.decrypt(
      job.company.companyEmail,
      process.env.CRYPTO_SECRET
    );
    decryptedEmail = decryptedEmail.toString(CryptoJS.enc.Utf8);

    job.company.companyEmail = decryptedEmail;

    res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to get all jobs with their companies
 * 1. Get all jobs
 * 2. Populate the company field with the company name
 * 3. Return all jobs with their companies
 */
export const getAllJobsWithTheirCompanies = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('company', 'companyName');

    res.status(200).json({
      success: true,
      message: 'All jobs retrieved successfully',
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getLastThreeJobsWithTheirCompanies = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('company', 'companyName');

    res.status(200).json({
      success: true,
      message: 'Last three jobs retrieved successfully',
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to get all jobs for a company
 * 1. Check if the company exists
 * 2. Get all jobs for the company
 * 3. Return all jobs for the company
 */
export const getAllJobsForACompany = async (req, res, next) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);

  if (!company) {
    return next(new Error('Company not found', { cause: 404 }));
  }

  try {
    const jobs = await Job.find({ company: companyId });

    res.status(200).json({
      success: true,
      message: 'All jobs retrieved successfully',
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobsForAHr = async (req, res, next) => {
  try {
    const jobs = await Job.find({ addedBy: req.user.id }).populate('company');

    res.status(200).json({
      success: true,
      message: 'All jobs retrieved successfully',
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to get all jobs that match a filter
 * 1. Get the filter from the request body
 * 2. Get all jobs that match the filter
 * 3. Return all jobs that match the filter
 */
export const getAllJobsThatMatchFilter = async (req, res, next) => {
  const filter = [];

  filter.push(req.body);
  console.log(...filter);

  try {
    const jobs = await Job.find(...filter).populate('company', 'companyName');

    res.status(200).json({
      success: true,
      message: 'All jobs retrieved successfully',
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to apply for a job
 * 1. Check if the job exists
 * 2. Check if the user has already applied for the job
 * 3. Create an application
 * 4. Return the application data
 */
export const applyForAJob = async (req, res, next) => {
  const { jobId } = req.params;
  const { userTechSkills, userSoftSkills, userResume } = req.body;

  const momentDate = moment().format('YYYY-MM-DD');

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return next(new Error('Job not found', { cause: 404 }));
    }

    const applicationExists = await Application.findOne({
      jobId,
      userId: req.user.id,
    });

    if (applicationExists) {
      return next(
        new Error('You have already applied for this job', { cause: 409 })
      );
    }

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      userTechSkills,
      userSoftSkills,
      userResume,
      applicationDate: momentDate,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
