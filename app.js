const express = require('express')
const cors = require('cors')
const path = require("path")
const cookieParser = require('cookie-parser')
const app = express();
require('dotenv').config();
const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SECRET_api_KEY
      }
    })
  );

app.use(express.json())
app.use(cookieParser())




// const allowedOrigins = ['http://localhost:3000'];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true 
// }));


app.post('/sendEmail', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, date } = req.body;

    await transporter.sendMail({
      to: 'vaqsii23@gmail.com',
      from: email,
      subject: 'Registration Successful',
      html: `<h1> name:${firstName} lastname: ${lastName}!</h1><p> scheduled is for ${date}, number is:${phone} .</p>`,
    });

    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.use(express.static(path.join(__dirname, './frontend/build')))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname,'./frontend/build/index.html' ))
})


const port = 4500;

app.listen(port, () => {
  console.log('Server is running on port', port);
});
