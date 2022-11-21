const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const expressSanitizer = require('express-sanitizer');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(helmet());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.use(expressSanitizer());


/*******************************************************************************
*********************** Route to Handle Form Submission ************************
*******************************************************************************/
app.post('/contact-us', (req, res) => {
  // Check if user opted to be added to mailing list
  // Used a number instead of a boolean value because a TINYINT value is used
  // to store it in the MySQL database.
  const addToMailingList = req.body['mailing-list'] ? 1 : 0;

  // Sanitize and trim form data
  const controlsToBeSanitized = ['name', 'email', 'subject', 'message'];
  controlsToBeSanitized.forEach((controlName) => req.body[controlName] = req.sanitize(req.body[controlName]).trim());

  /********************* Store message in MySQL database **********************/
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //The database password is stored in an environmental variable.
    password: process.env.DB_PW,
    database: 'contact_us'
  });

  // All methods invoked on the connection object are queued.
  connection.connect(err => {
    if (err) {
      console.log('Error while connecting to MySQL database');
    } else {
      console.log('Connected to MySQL database.');
    }
  });

  const insertQueryString = 'INSERT INTO messages SET name = ?, email = ?, mailing_list = ?, subject = ?,  message = ?';
  const values = [req.body.name, req.body.email, addToMailingList, req.body.subject, req.body.message];

  connection.query(insertQueryString, values, (err, rows, fields) => {
    if (err) {
      console.log('Error while performing INSERT Query.')
    };
  });

  connection.end(err => {
    if (err) {
      console.log('Error while terminating connection.');
    }
  });

  /*************** Send confirmation email to user and to me ******************/
  // Create a Nodemailer transporter object
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
      //The username and password are stored in environmental variables.
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PW 
    }
  });

  // Set email options
  const mailOptions = {
    from: '"David Garrison" <dave@whyinterviewdave.com>',
    to: `${req.body.email}, dcg484@gmail.com`,
    subject: 'Self-Drawing Form Message Received',
    // HTML body
    html: `<p>Hi <span style="font-weight: bold;">${req.body.name}</span>,</p>
           <p>Thank you for sending us the following message:</p>
           <p>Subject: <span style="font-weight: bold;">${req.body.subject}</span></p>
           <p><span style="font-weight: bold;">${req.body.message}</span></p>
           <p>You should hear back from us soon.</p>`
  };

  // Use middleware that converts HTML body into plain text body
  transporter.use('compile', htmlToText());

  // Send Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  });

  /********************** Render the confirmation view ************************/
  res.render('confirmation', {
    name: req.body.name,
    email: req.body.email,
    addToMailingList,
    subject: req.body.subject,
    message: req.body.message
  });
});


app.use((req, res) => res.status(404).render('url-not-found'));


/****************************** Error Handler *********************************/
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send('Server Error!')
});


app.listen(PORT, () => console.log(`\nSelf-Drawing Form App listening on port ${PORT}!`))
