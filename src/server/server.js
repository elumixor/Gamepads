const express = require('express');
const fs = require('fs')
const hbs = require('nodemailer-express-handlebars')

const productsPath = './products.json'
const boundsPath = './bounds/bounds.json'


let products
let bounds
let lastChangeProducts
let lastChangeBounds

function updateProducts() {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    lastChangeProducts = fs.statSync(productsPath).mtime;
}

function updateBounds() {
    bounds = JSON.parse(fs.readFileSync(boundsPath, 'utf8'))
    lastChangeBounds = fs.statSync(boundsPath).mtime;
}

updateProducts()
updateBounds()

const PORT = process.env.PORT || 5000

const app = new express();

app.use(express.static('./src/client'))
app.use('/images', express.static('./images'))
app.use('/bounds', express.static('./bounds'))
app.use(express.json());

app.get('/products', function (request, response) {
    const ch = fs.statSync(productsPath).mtime;
    if (ch > lastChangeProducts) updateProducts()

    response.json(products)
})


app.get('/bounds', function (request, response) {
    const ch = fs.statSync(boundsPath).mtime;
    if (ch > lastChangeBounds) updateBounds()

    response.json(bounds)
})


app.post('/order', function (request, response) {
    console.log(request.body);      // your JSON
    response.send(request.body);    // echo the result back
});

app.listen(PORT)

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

transporter.use('compile', hbs(handlebarOptions));

// Step 3
let mailOptions = {
    from: 'tabbnabbers@gmail.com', // TODO: email sender
    to: 'deltamavericks@gmail.com', // TODO: email receiver
    subject: 'Nodemailer - Test',
    text: 'Wooohooo it works!!',
    template: 'index',
    attachments: [
        {filename: 'logo.jpg', path: './images/logo.jpg'}
    ],
    context: {
        name: 'Accime Esterling'
    } // send extra values to template
};

// Step 4
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return console.log(err);
    }
    return console.log('Email sent!!!');
});
