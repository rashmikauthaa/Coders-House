
const { Jimp } = require('jimp');
const path = require('path');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController {
    async activate(req, res) {
        const { name, avatar } = req.body;
        
     
        if (!name || !avatar) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Extract file extension from Base64
        const match = avatar.match(/^data:image\/(\w+);base64,/);
        const ext = match ? match[1] : 'png'; // Default to PNG if no match
       
        // Convert Base64 to Buffer
        const buffer = Buffer.from(avatar.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        // Generate a unique image name with the correct extension
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        
    
            try {
                const jimResp = await Jimp.read(buffer);
                // Remove the resize call to avoid compressing/changing dimensions.
                jimResp.write(path.resolve(__dirname, `../storage/${imagePath}`), (err) => {
                    if (err) {
                        console.error("Error writing image:", err);
                        return res.status(500).json({ message: 'Could not save the image' });
                    }
                 
                    res.json({ message: 'Image saved successfully' });
                });
            
            } catch (error) {
                console.error("Jimp processing error:", error);
                return res.status(500).json({ message: 'Could not process the image' });
            }
            

        const userId = req.user._id;
        // update user
        try {
            const user = await userService.findUser({_id: userId});
        if(!user){
            res.status(404).json({message: 'User not found!'});
        }

        user.activated = true;
        user.name = name;
        user.avatar = `/storage/${imagePath}`;
        user.save();
        res.json({ user: new UserDto(user), auth: true });
        }
        catch(error){
            return res.status(500).json({ message: 'Something went wrong' });
        }
        
    }
}

module.exports = new ActivateController();
