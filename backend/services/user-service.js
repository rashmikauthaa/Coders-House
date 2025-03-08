const UserModel = require('../models/user-model');

class UserService {
    async findUser(filter) {
        try {
            return await UserModel.findOne(filter);
        } catch (error) {
            console.error("Error finding user:", error);
            throw new Error("Database query failed");
        }
    }

    async createUser(data) {
        try {
            return await UserModel.create(data);
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("User creation failed");
        }
    }
}

module.exports = new UserService();
