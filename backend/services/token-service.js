const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error("JWT secrets are not defined in environment variables.");
}

class TokenService {
    generateTokens(payload) {
        if (!payload || typeof payload !== 'object') {
            throw new Error("Invalid payload for JWT generation.");
        }

        const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '1y' });

        return { accessToken, refreshToken };
    }
}

module.exports = new TokenService();
