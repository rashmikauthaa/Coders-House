const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone field is required!" });
    }

    try {
      // Generate OTP
      const otp = await otpService.generateOtp();

      // Hash OTP
      const ttl = 1000 * 60 * 2; // 2 minutes expiration
      const expires = Date.now() + ttl;
      const data = `${phone}.${otp}.${expires}`;
      const hash = hashService.hashOtp(data);

      // Send OTP via SMS
      //    const out =  await otpService.sendBySms(phone, otp);
      //console.log(out);
      return res.json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      });
    } catch (error) {
      console.error("Twilio Error:", error.message);
      return res.status(500).json({ message: "Message sending failed" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashedOtp, data); // Fixed: Use hashService for validation

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = null; // Explicitly initialized to avoid undefined issues
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    // cookies
    res.cookie("refreshtoken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
    });

    res.json({ accessToken });
  }
}

module.exports = new AuthController();
