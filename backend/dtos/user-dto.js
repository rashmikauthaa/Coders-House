class UserDto {
    constructor(user) {
        this._id = user._id;
        this.phone = user.phone;
        this.activated = user.activated;
    }
}
module.exports = UserDto;
