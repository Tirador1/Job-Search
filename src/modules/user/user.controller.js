import User from "./../../../DB/models/user.collection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Steps to create a user
 * 1. Check if the user exists
 * 2. Create a user
 * 3. Return the user data
 */
export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    OTP,
  });
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res.status(201).json({ message: "User Created Successfully", user });
};

/**
 * Steps to login a user
 * 1. Check if the user exists
 * 2. Check if the password is valid
 * 3. Create and sign the JWT token
 * 4. Return the token
 * 5. Update the user status to online
 * 6. Return the user data
 */
export const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: username }, { mobileNumber: username }],
  });
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return next(new Error("Invalid password", { cause: 401 }));
  }
  user.status = "online";
  await user.save();

  // Create and sign the JWT token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res.status(200).json({ message: "Login successful", token });
};

/**
 * Steps to update a user
 * 1. Check if the user exists
 * 2. Update the user
 * 3. Return the user data
 */
export const updateAccount = async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
    status,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      username,
      email,
      recoveryEmail,
      DOB,
      mobileNumber,
      role,
      status,
    },
    { new: true }
  );
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res.status(200).json({ message: "User Updated Successfully", user });
};

/**
 * Steps to delete a user
 * 1. Check if the user exists
 * 2. Delete the user
 * 3. Return the user data
 */
export const deleteAccount = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res.status(200).json({ message: "User Deleted Successfully" });
};

/**
 * Steps to get user data
 * 1. Check if the user exists
 * 2. Return the user data
 */
export const getUserAccountData = async (req, res, next) => {
  const user = await User.findById(req.user.id, { password: 0 });
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res.status(200).json({ message: "User Data Fetched Successfully", user });
};

/**
 * Steps to get Profile data
 * 1. Check if the user exists
 * 2. Return the user data
 */
export const getProfileData = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res.status(200).json({ message: "User Data Fetched Successfully", user });
};

/**
 * Steps to update password
 * 1. Check if the user exists
 * 2. Check if the password is valid
 * 3. Update the password
 * 4. Return the user data
 */
export const updatePassword = async (req, res, next) => {
  const { currentPassword, password } = req.body;
  const user = await User.findById(req.user.id);
  const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new Error("Invalid password", { cause: 401 }));
  }
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { hashedPassword },
    { new: true }
  );
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res
    .status(200)
    .json({ message: "Password Updated Successfully", updatedUser });
};

/**
 * Steps to reset the forgotten password
 * 1. Check if the user exists
 * 2. Check if the OTP is valid
 * 3. Update the password
 * 4. Return the user data
 */
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  const { OTP } = req.body;
  if (OTP !== user.OTP) {
    return next(new Error("Invalid OTP", { cause: 401 }));
  }
  const newPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { hashedPassword },
    { new: true }
  );
  if (!updatedUser) {
    return next(new Error("User is not found", { cause: 404 }));
  }
  res.status(200).json({ message: "Password Updated Successfully", user });
};

/**
 * Steps to get accounts by recovery email
 * 1. Check if the user exists
 * 2. Return the user data
 */
export const getAccountsByRecoveryEmail = async (req, res, next) => {
  const { recoveryEmail } = req.body;
  const users = await User.find({ recoveryEmail }, { password: 0 });
  if (!users) {
    return next(new Error("Users are not found", { cause: 404 }));
  }
  res.status(200).json({ message: "Users Data Fetched Successfully", users });
};
