const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');


const handleLogin = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) res.status(400).json({ message: 'username and password must be included' });
    const cookies = req.cookies;
    const refreshToken = cookies.jwt; 

    const foundUser = await User.findOne({ username }).exec();
    if (!foundUser) return res.status(400).json({ message: 'no user with this username' })

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {

        const roles = Object.values(foundUser.roles)
        let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(token => token !== refreshToken)
        
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        );

        const newRefreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        if (cookies?.jwt) {

            const user = await User.findOne({ refreshToken }).exec();

            if (!user) {
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
        }

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

        const result = await foundUser.save();

        res.cookie('jwt', newRefreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
            
        res.status(200).json({ accessToken });
    }
}


module.exports = handleLogin;