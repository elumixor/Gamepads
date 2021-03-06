const parseOrder = require('./orderParser').parseOrder
const hbs = require('nodemailer-express-handlebars')
const fs = require('fs')

const {login, password, from, to} = require('../../sensitive/mailCredentials.json')
const nodemailer = require('nodemailer');

// Create two transporters to workaround the issue whre both email used the same email html layout
const mailOptions = {
    host: 'mail.netangels.ru',
    auth: {
        user: login,
        pass: password
    }
}

const transporter1 = nodemailer.createTransport(mailOptions);
const transporter2 = nodemailer.createTransport(mailOptions);

function sendToCustomLab(email) {
    // Configure view
    transporter1.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: './src/server/views',
            layoutsDir: './src/server/views',
            defaultLayout: 'index.hbs',
        },
        viewPath: './src/server/views',
        extName: '.hbs'
    }));

    transporter1.sendMail({
            from, // Send from CustomLab
            to,  // Send to CustomLab (notify itself)
            subject: 'New order - CustomLab',
            template: 'index',
            attachments: [
                {filename: 'cart.json', path: './attachments/cart.json'},
                {filename: 'userData.json', path: './attachments/userData.json'}
            ],
            context: {email}
        },
        (err, data) => {
            if (err) {
                console.error('Could not send email.', err)
            } else {
                console.log('Email sent to CustomLab.', data)
            }
        })
}

function sendToClient(email) {
    transporter2.use('compile', hbs({
        viewEngine: {
            extName: '.hbs',
            partialsDir: './src/server/viewsClient',
            layoutsDir: './src/server/viewsClient',
            defaultLayout: 'index.hbs',
        },
        viewPath: './src/server/viewsClient',
        extName: '.hbs'
    }));

    transporter2.sendMail({
        from, // Send from CustomLab
        to: email, // Send to client
        subject: 'New order - CustomLab',
        template: 'index'
    }, (err, data) => {
        if (err) {
            console.error('Could not send email.', err)
        } else {
            console.log('Email sent to client.', data)
        }
    })
}

async function sendMail(order) {
    const {userData, cart} = order
    const {email} = userData

    // Write attachment file
    fs.writeFileSync('./attachments/cart.json', JSON.stringify(cart))
    fs.writeFileSync('./attachments/userData.json', JSON.stringify(userData))

    sendToCustomLab(email)
}

module.exports = {sendMail}
