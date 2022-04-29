const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendMail = require('../config/email');
const brcypt = require('bcrypt');


const registrationController = async (req, res) => {
    try {
    const { firstname, lastname, email, username, password } = req.body;

    if (!firstname || !lastname || !email || !username || !password) return res.status(400).json({ message: "firstname, lastname, username and password must be included" });
    
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) return res.status(400).json({ message: "email already exists in database" });
    
    const hashedPassword = await brcypt.hash(password, 10);

    const confirmationToken = jwt.sign(
        { username },
        process.env.SECRET_KEY,
        { expiresIn: '5m' }
    );
    
    text = `This is your confirmation link: http://localhost:3500/confirm/${confirmationToken}`;
    html = `<p>This is your confirmation link: http://localhost:3500/confirm/${confirmationToken}</p>`;

    if (email === process.env.ADMIN) {
        const result = await User.create({
            firstname,
            lastname,
            email,
            roles: {
                User: 2000,
                Moderator: 2020,
                Admin: 2040
            },
            username,
            password: hashedPassword
        });
        
        const emailResult = await sendMail(process.env.ADMIN, email, 'Confirmation Email', text, html);

        return res.status(201).json({ message: `User ${username} created` });
    }else {
        const result = await User.create({
            firstname,
            lastname,
            email,
            username,
            password: hashedPassword
        });
        
        const emailResult = await sendMail(process.env.ADMIN, email, 'Confirmation Email', text, html);

        return res.status(201).json({ message: `User ${username} created` });
    };
        
    }catch (err) {
        console.log(err)
    }
};


module.exports = registrationController;