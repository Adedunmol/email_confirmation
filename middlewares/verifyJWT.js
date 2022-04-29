const jwt = require('jsonwebtoken');
const userConfirmed = require('./confirmed');
const User = require('../models/User');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'no token in headers' });

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, data) => {
            if (err) return res.status(403).json({ messsage: 'bad token' })

            const foundUser = await User.findOne({ username: data.UserInfo.username }).exec();

            req.user = data.UserInfo.username;
            req.roles = data.UserInfo.roles;
            req.userConfirmed = foundUser.confirmed;
            next();
        }
    )
};

module.exports = verifyJWT;