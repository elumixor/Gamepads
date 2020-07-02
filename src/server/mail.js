const nodemailer = require("nodemailer")

const credentials = require('../../sensetive/mail_credentials.json')


let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: credentials['login'],
        pass: credentials['password']
    }
});

const message = {
    from: 'elonmusk@tesla.com', // Sender address
    to: 'vladogim97@gmail.com',         // List of recipients
    subject: 'Design Your Model S | Tesla', // Subject line
    text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
};
transport.sendMail(message, function (err, info) {
    if (err) {
        console.log(err)
    } else {
        console.log(info);
    }
});
