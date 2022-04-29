const { text } = require('express');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });


const sendMail = async (from, to, subject, text, html) => {
    try{
        //get access token
        const accessToken = await oAuth2Client.getAccessToken();

        //create transport for sending mails
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'oyewaleadedunmola@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        };

        const result = await transport.sendMail(mailOptions);

    }catch (err) {
        console.log(err);
    };
};


module.exports = sendMail;