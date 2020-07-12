const parseOrder = require('./orderParser').parseOrder

const hbs = require('nodemailer-express-handlebars')
const fs = require('fs')

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "8e6eb905a0edaf",
        pass: "6c5399dec35028"
    }
});

const handlebarOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: './src/server/views',
        layoutsDir: './src/server/views',
        defaultLayout: 'index.hbs',
    },
    viewPath: './src/server/views',
    extName: '.hbs',

};


// Step 3
let mailOptions = {
    from: 'tabbnabbers@gmail.com', // TODO: email sender
    to: 'deltamavericks@gmail.com', // TODO: email receiver
    subject: 'New order - CustomLab',
    template: 'index',
    attachments: [
        {filename: 'cart.json', path: './attachments/cart.json'}
    ],
};

function sendMail(order) {
    mailOptions.context = {email: order.email}
    fs.writeFileSync('./attachments/cart.json', JSON.stringify(order.cart))
    transporter.use('compile', hbs(handlebarOptions));
    // Step 4
    transporter.sendMail(mailOptions,
        (err, data) => err ? console.log(err) : console.log('Email sent!', data));
}

module.exports = {sendMail}
