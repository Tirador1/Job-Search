import Joi from "joi";

export const signUpSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    recoveryEmail: Joi.string().email().required(),
    DOB: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string().required(),
  }),
});

export const signInSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().optional(),
    mobileNumber: Joi.string().optional(),
    password: Joi.string().required(),
  }),
});

export const updateAccountSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().optional(),
    mobileNumber: Joi.string().optional(),
    role: Joi.string().optional(),
    status: Joi.string().optional(),
  }),
});

export const deleteAccountSchema = Joi.object({
  body: Joi.object({
    password: Joi.string().required(),
  }),
});

export const getProfileDataSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }),
});

export const updatePasswordSchema = Joi.object({
  body: Joi.object({
    password: Joi.string().required(),
  }),
});

export const forgetPasswordSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
});

export const getAccountsByRecoveryEmailSchema = Joi.object({
  query: Joi.object({
    recoveryEmail: Joi.string().email().required(),
  }),
});
