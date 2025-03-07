const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');


class AuthController {
    async sendOtp(req, res) {
        // logic
        const { phone } = req.body;
        if(!phone) {
            return res.status(400).json({message : 'phone field is required!'});
        }

        // sending OTP
        const otp = await otpService.generateOtp();

        // Hashing OTP
        const ttl = 1000 * 60 * 2; // exp time = 2mins
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // Send OTP
        try{
            await otpService.sendBySms(phone, otp);
            return res.json({
                hash: `${hash}.${expires}`,
                phone,
            });
        }
        catch(error){
            console.error("Twilio Error:", error.message);
            res.status(500).json({message: 'message sending failed'});
        }

        // res.json({otp: otp});
        // res.json({hash: hash});


        
    };

    verifyOtp(req, res){
        // logic
        const {otp, hash, phone} = req.body;
        if(!otp || !hash || !phone){
            res.status(400).json({message: 'All fields are required'});
        }

        const [hashedOtp, expires] = hash.split('.');
        if(Date.now() > expires){
            res.status(400).json({message: 'OTP expired!'});
        }

        const data = `${phone}.${otp}.${expires}`;

        const isValid = otpService.verifyOtp(hashedOtp, data);

        if(!isValid){
            res.status(400).json({message: 'Invalud OTP'});
        }

        let user;
        let accessToken;
        let refreshToken;
    };
}

module.exports = new AuthController();