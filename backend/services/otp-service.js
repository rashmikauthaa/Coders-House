const crypto = require('crypto');
const hashService = require('./hash-service');
const e = require('express');

const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const smsNumber = process.env.SMS_AUTH_NUMBER;
const smsSid = process.env.SMS_SID;
const twilio = require("twilio")(smsSid, smsAuthToken, {
  lazyLoading: true, // optmizes by avoiding servcies when not required
});

class otpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
    console.log(smsNumber);
    if (!smsNumber) {
      throw new Error(
        "Twilio phone number (SMS_AUTH_NUMBER) is not set in .env"
      );
    }
    console.log(`Sending OTP ${otp} to ${phone}`);
    try {
      return await twilio.messages.create({
        to: phone,
        from: smsNumber,
        body: `Your CodersHouse OTP is ${otp}`,
      });
    } catch (error) {
      console.error("Twilio SMS Error:", error.message);
      throw new Error("Failed to send OTP. Please try again.");
    }
  }

  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);

    return computedHash === hashedOtp;
    // if(computedHash === hashedOtp) return true;
    // else return false;
  }
}

module.exports = new otpService();