const cookieParser = require('cookie-parser');
const { popper } = require('popper.js');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = require('jquery');


var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    myDb = require('../models/dbConnection');

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//sablon kullanacaksak lazim 
// var myEjsLayouts = require('express-ejs-layouts')
// app.use(myEjsLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../server/views'));

require('../Routers/RoutersManager')(app);

app.listen(1609)