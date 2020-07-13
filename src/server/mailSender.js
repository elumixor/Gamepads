const parseOrder = require('./orderParser').parseOrder
const hbs = require('nodemailer-express-handlebars')
const fs = require('fs')

const {login, password, from, to} = require('../../sensetive/mailCredentials.json')
const nodemailer = require('nodemailer');

// Create two transporters to workaround the issue whre both email used the same email html layout
const transporter1 = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: login,
        pass: password
    }
});

const transporter2 = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: login,
        pass: password
    }
});

async function sendToCustomLab(email) {
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

    return new Promise((res, rej) => {
        transporter1.sendMail({
                from, // Send from CustomLab
                to,  // Send to CustomLab (notify itself)
                subject: 'New order - CustomLab',
                template: 'index',
                attachments: [
                    {filename: 'cart.json', path: './attachments/cart.json'}
                ],
                context: {email}
            },
            (err, data) => {
                if (err) {
                    console.error('Could not send email.', err)
                    rej(err)
                } else {
                    console.log('Email sent to CustomLab.', data)
                    res()
                }
            })
    })
}

async function sendToClient(email) {
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

    return new Promise((res, rej) => {
        transporter2.sendMail({
            from, // Send from CustomLab
            to: email, // Send to client
            subject: 'New order - CustomLab',
            template: 'index'
        }, (err, data) => {
            if (err) {
                console.error('Could not send email.', err)
                rej(err)
            } else {
                console.log('Email sent to client.', data)
                res()
            }
        })
    })
}

async function sendMail(order) {
    const email = order.email

    // Write attachment file
    fs.writeFileSync('./attachments/cart.json', JSON.stringify(order.cart))

    await Promise.all([sendToCustomLab(email), sendToClient(email)])
}

module.exports = {sendMail}
