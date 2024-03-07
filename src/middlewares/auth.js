import User from "../../DB/models/user.collection.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const { accesstoken } = req.headers;
  if (!accesstoken) {
    return next(new Error("Access token is required", { cause: 401 }));
  }
  const token = accesstoken.split("__")[1];
  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedData.userId);
    if (!user) {
      return next(
        new Error("User is not found in the database", { cause: 404 })
      );
    }
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return next(new Error("Invalid access token", { cause: 401 }));
  }
};
