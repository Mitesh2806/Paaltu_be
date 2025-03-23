import axios from "axios"; // Not used now for OTP but kept if needed later
import path from "path";
import dotenv from "dotenv";
import utils from "../utils/index.js"; // adjust path as needed
import log from "../middlewares/logger.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Global in-memory store for OTPs (for testing only)
const otpStore = {};

// -----------------------------------------------------------------------------
// Simulated OTP Generation
// -----------------------------------------------------------------------------
export async function sendOtp(req, res) {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ status: "error", message: "Mobile number is required." });
    }

    // Validate mobile number format (change the regex if needed)
    if (!/^\d{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid mobile number format." });
    }

    // Generate a random 4-digit OTP as a string
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP in the temporary in-memory store
    otpStore[mobile] = otp;

    // For testing purposes, log the OTP
    console.log(`Generated OTP for mobile ${mobile}: ${otp}`);

    // Return the OTP (acting as requestId) in the response so you can use it for verification
    return res.status(200).json({ status: "success", data: otp });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
}

// -----------------------------------------------------------------------------
// Simulated OTP Verification
// -----------------------------------------------------------------------------
export async function verifyOtp(req, res) {
  try {
    const { otpReqId, otp, email, name } = req.body;

    // Get mobile number from header (ensure your client sends it)
    const mobile = req.headers.mobile;
    if (!mobile) {
      return res
        .status(400)
        .json({ status: "error", message: "Mobile number not provided in headers." });
    }

    // Retrieve the stored OTP for this mobile number
    const storedOtp = otpStore[mobile];
    if (!storedOtp) {
      return res
        .status(400)
        .json({ status: "error", message: "No OTP generated for this mobile." });
    }

    // Compare the OTP provided by the user with the stored OTP
    if (storedOtp !== otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid OTP." });
    }

    // OTP is verified; remove it from our store
    delete otpStore[mobile];

    // Generate a dummy auth token for testing purposes
    const authToken = "dummyauthtoken_" + mobile;

    // Optionally, you could upsert the user in your database here using utils.upsertUserInDB()
    // await utils.upsertUserInDB(name, email, mobile, authToken);

    return res
      .status(200)
      .json({ status: "success", data: { verified: true, mobile, authToken } });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
}

// -----------------------------------------------------------------------------
// Example function: Get User From DB (if needed)
// -----------------------------------------------------------------------------
export async function getUserFromDb(req, res) {
  log.info(req.user && req.user.userId);
  return res.status(200).json({
    status: "success",
    data: req.user,
  });
}
