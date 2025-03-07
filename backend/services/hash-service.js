const crypto = require('crypto');

class HashService {
    hashOtp(data) {
        const secret = process.env.HASH_SECRET;

        if (!secret) {
            throw new Error("HASH_SECRET is not defined in the environment variables.");
        }

        return crypto.createHmac('sha256', Buffer.from(secret, 'utf-8'))
        .update(data).digest('hex');
    }
}

module.exports = new HashService();
