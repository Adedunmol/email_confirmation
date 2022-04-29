const jwt = require('jsonwebtoken');
const sendMail = require('../config/email');
const User = require('../models/User');


const sendNewConfirmationMail = async (req, res) => {
    try {
        const user = req.user;

        const foundUser = await User.findOne({ username: user }).exec();
        if (!user) return res.status(403).json({ message: 'no username in token' });

        const confirmationToken = jwt.sign(
            { "username": user },
            process.env.SECRET_KEY,
            { expiresIn: '10m' }
        );
        
        text = `This is your confirmation link: http://localhost:3500/confirm/${confirmationToken}`;
        html = `<p>This is your confirmation link: http://localhost:3500/confirm/${confirmationToken}</p>`;
        
        const emailResult = await sendMail(process.env.ADMIN, foundUser.email, 'Confirmation Email', text, html);
    
        return res.status(201).json({ message: `email sent` });
    }catch (err) {
        console.log(err)
    }
};

module.exports = sendNewConfirmationMail;