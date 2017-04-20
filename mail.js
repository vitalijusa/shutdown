'use strict';
const nodemailer = require('nodemailer');

module.exports = {
    Mail : Mail
};

function Mail(emailUser, password, from, to) {
    var self = this;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    self.send = function(subject, text) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: from, //'"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
            to: to, //'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
            subject: subject, //'Hello ✔', // Subject line
            text: text //'Hello world ?', // plain text body
            // html: '<b>Hello world ?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    };

}