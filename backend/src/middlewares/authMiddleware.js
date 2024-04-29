import { User } from "../models/userModal.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

//================== verify JWT ==========================
function verifyJWT(req, res, next) {
  // Get the JWT token from the Authorization header
  const token = req.headers["authorization"];

  // Check if the token is provided
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Failed to authenticate token." });
      }

      // If token is valid, save decoded token to request for use in other routes
      req.decoded = decoded;
      next();
    }
  );
}

//===================== authorization =======================
const checkRole = (roleParameter) => {
  return async (req, res, next) => {
    try {
      const email = req.decoded.email;
      const userDetails = await User.findOne({ email });

      if (!userDetails) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      if (!roleParameter.includes(userDetails.role)) {
        return res.status(401).json({
          success: false,
          message: `This is a Protected Route for ${roleParameter.join(
            " or "
          )}`,
        });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: `User Role Can't be Verified` });
    }
  };
};

export { verifyJWT, checkRole };
