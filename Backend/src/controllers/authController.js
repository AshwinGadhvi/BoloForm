import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendEmailOTP } from "../services/emailService.js";

// ------------------------------------------------------
// REGISTER USER (Name + Email + Mobile + Password)
// ------------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ $or: [{ email }, { mobile }] });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      user,
      token: generateToken(user._id),
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ------------------------------------------------------
// LOGIN USER (Email OR Mobile + Password)
// ------------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    return res.json({
      message: "Login successful",
      user,
      token: generateToken(user._id),
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ------------------------------------------------------
// SEND OTP (To Email OR Mobile)
// ------------------------------------------------------
export const sendOtp = async (req, res) => {
  try {
    const contact = req.body.contact.trim().toLowerCase();

    if (!contact) {
      return res.status(400).json({ message: "Contact is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await OTP.findOneAndUpdate(
      { contact },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    if (contact.includes("@")) {
      await sendEmailOTP(contact, otp);
      return res.json({ message: "OTP sent to email" });
    }

    return res.json({ message: "OTP sent", otp });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ------------------------------------------------------
// VERIFY OTP (Login or Create Account if New)
// ------------------------------------------------------
export const verifyOtp = async (req, res) => {
  try {
    const contact = req.body.contact.trim().toLowerCase();
    const { otp, name } = req.body;

    if (!contact || !otp) {
      return res.status(400).json({ message: "Contact & OTP are required" });
    }

    const otpRecord = await OTP.findOne({ contact });

    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({
      $or: [{ email: contact }, { mobile: contact }],
    });

    if (!user) {
      if (!name) {
        return res.status(400).json({ message: "Name required for new user" });
      }

      user = await User.create({
        name,
        email: contact.includes("@") ? contact : undefined,
        mobile: contact.includes("@") ? undefined : contact,
      });
    }

    await otpRecord.deleteOne();

    return res.json({
      message: "OTP verified successfully",
      user,
      token: generateToken(user._id),
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

