const jwt = require('jsonwebtoken');
const User = require('../models/User');


const confirmMail = (req, res) => {
    const { confirmToken } = req.params;
    const user = req.user;
    if (!confirmToken) return res.status(403).json({ message: 'no confirmation token' });

    jwt.verify(
        confirmToken,
        process.env.SECRET_KEY,
        async (err, data) => {
            if (err) return res.status(401).json({ messagw: 'bad token' });

            const username = data.username;
            const foundUser = await User.findOne({ username }).exec();
            
            if (!foundUser) return res.status(403).json({ message: 'no user with this token' });

            console.log(user);
            console.log(foundUser.username);
            if (foundUser.username !== user) return res.status(403).json({ message: 'username with token does not match with current user' });

            foundUser.confirmed = true;

            const result = await foundUser.save();
            res.status(200).json({ message: 'user confirmed' })
        }
    )
}


module.exports = confirmMail;