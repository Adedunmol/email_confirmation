const jwt = require('jsonwebtoken');
const User = require('../models/User')


const getNewTokens = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(403).json({ message: 'no cookies' });
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    //reuse detected
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, data) => {
                if (err) return res.status(403).json({ message: 'bad token' });

                const username = data.username;
                const user = User.findOne({ username }).exec();
                user.refreshToken = []; 
                const result = await user.save();
            }
        )
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, data) => {

            roles = Object.values(foundUser.roles)
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }

            if (err || data.username !== foundUser.username) return res.status(403).json({ message: 'bad token' })

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
                {username: data.username},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
            const result = await foundUser.save();

            res.cookie('jwt', newRefreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})

            res.status(200).json({ accessToken })
        }
    )
    
}

module.exports = getNewTokens;