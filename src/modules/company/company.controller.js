import Company from '../../../DB/models/company.collection.js';
import Application from '../../../DB/models/application.collection.js';
import Job from '../../../DB/models/job.collection.js';
import moment from 'moment';
import xl from 'excel4node';
import CryptoJS from 'crypto-js';

/**
 * Steps to create a company
 * 1. Check if the user is a company HR
 * 2. Create a company
 * 3. Return the company data
 */
export const createCompany = async (req, res, next) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  if (req.user.role !== 'Company_HR') {
    return next(
      new Error('You are not allowed to create a company', { cause: 403 })
    );
  }

  const encryptedEmail = CryptoJS.AES.encrypt(
    companyEmail,
    process.env.CRYPTO_SECRET
  ).toString();

  console.log('encryptedEmail:', encryptedEmail);

  const isEmailExists = await Company.findOne({
    companyEmail,
  });
  if (isEmailExists) {
    return next(
      new Error('Company with this email already exists', { cause: 409 })
    );
  }

  const company = await Company.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail: encryptedEmail,
    companyHR: req.user.id,
  });

  if (!company) {
    return next(new Error('Company not created', { cause: 400 }));
  }

  res.status(201).json({
    success: true,
    message: 'Company created successfully',
    data: company,
  });
};

/**
 * Steps to update a company
 * 1. Check if the user is a company HR
 * 2. Check if the company exists
 * 3. Update the company
 */
export const updateCompany = async (req, res, next) => {
  const { companyId } = req.params;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return next(new Error('Company not found', { cause: 404 }));
    }

    if (
      req.user.role !== 'Company_HR' ||
      req.user.id.toString() !== company.companyHR.toString()
    ) {
      return next(
        new Error('You are not allowed to update this company', { cause: 403 })
      );
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to delete a company
 * 1. Check if the user is a company HR
 * 2. Check if the company exists
 * 3. Delete the company
 * 4. Delete all the jobs of the company
 * 5. Delete all the applications of the company
 */
export const deleteCompany = async (req, res, next) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return next(new Error('Company not found', { cause: 404 }));
    }

    if (
      req.user.role !== 'Company_HR' ||
      req.user.id.toString() !== company.companyHR.toString()
    ) {
      return next(
        new Error('You are not allowed to delete this company', { cause: 403 })
      );
    }

    await Company.findByIdAndDelete(companyId);
    await Job.deleteMany({ companyId });
    await Application.deleteMany({ companyId });

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCompaniesForHR = async (req, res, next) => {
  try {
    const companies = await Company.find({ companyHR: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Companies retrieved successfully',
      data: { companies },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to get company data
 * 1. Check if the user is a company HR
 * 2. Check if the company exists
 * 3. Get the company data
 * 4. Get all the jobs of the company
 */
export const getCompanyData = async (req, res, next) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return next(new Error('Company not found', { cause: 404 }));
    }

    if (
      req.user.role !== 'Company_HR' ||
      req.user.id.toString() !== company.companyHR.toString()
    ) {
      return next(
        new Error('You are not allowed to access this company data', {
          cause: 403,
        })
      );
    }

    const jobs = await Job.find({ companyId });

    res.status(200).json({
      success: true,
      message: 'Company data retrieved successfully',
      data: {
        company,
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to get all companies
 * 1. Get all the companies
 * 2. Return the companies
 * 3. If no companies found, return an empty array
 */
export const searchCompanyByName = async (req, res, next) => {
  const { companyName } = req.query;

  try {
    const companies = await Company.find({
      companyName: { $regex: companyName, $options: 'i' },
    });

    res.status(200).json({
      success: true,
      message: 'Companies retrieved successfully',
      data: { companies },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to get all applications for a Job
 * 1. Get the company
 * 2. Check if the user is a company HR
 * 3. Check if the company exists
 * 4. Get all the jobs of the company
 */
export const getApplicationsForJobs = async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new Error('Job not found', { cause: 404 }));
    }

    const applications = await Application.find({ jobId });
    if (!applications) {
      return next(new Error('Applications not found', { cause: 404 }));
    }

    res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      data: { applications },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Steps to collect the application and create an excel sheet
 * 1. Get the company
 * 2. Check if the user is a company HR
 * 3. Check if the company exists
 * 4. Check the Role of the user
 * 5. Get all the jobs of the company
 * 6. Get all the applications for the jobs
 * 7. Create an excel sheet
 * 8. Return the excel sheet
 */
export const collectTheApplicationAndCreateExcelSheet = async (
  req,
  res,
  next
) => {
  const { companyId } = req.params;

  const date = moment().format('YYYY-MM-DD');

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return next(new Error('Company not found', { cause: 404 }));
    }

    if (
      req.user.role !== 'Company_HR' ||
      req.user.id.toString() !== company.companyHR.toString()
    ) {
      return next(
        new Error(
          'You are not allowed to access applications for this company',
          {
            cause: 403,
          }
        )
      );
    }

    const jobs = await Job.find({ company: companyId });
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
      applicationDate: date,
    }).populate('userId', '-password -__v -createdAt -updatedAt');

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Applications');

    const headingColumnNames = [
      'Name',
      'Email',
      'Phone',
      'Tech Skills',
      'Soft Skills',
      'Resume',
    ];

    let headingColumnIndex = 1;
    headingColumnNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    const rows = [];

    applications.map((application) => {
      rows.push(Object.values(JSON.parse(JSON.stringify(application))));
    });

    let rowIndex = 2;
    rows.forEach((row) => {
      ws.cell(rowIndex, 1).string(row[2].username);
      ws.cell(rowIndex, 2).string(row[2].email);
      ws.cell(rowIndex, 3).string(row[2].mobileNumber);
      ws.cell(rowIndex, 4).string(row[3].join(', '));
      ws.cell(rowIndex, 5).string(row[4].join(', '));
      ws.cell(rowIndex, 6).string(row[5]);
      rowIndex++;
    });

    const fileName = `Applications-${date}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    wb.writeToBuffer().then((buffer) => {
      res.send(buffer);
    });
  } catch (error) {
    next(error);
  }
};
