require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Allow server to accept JSON data

app.get('/', (req, res) => {
    res.send('Email server is running');
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address from .env file
            pass: process.env.EMAIL_PASS, // Your app password from .env file
        },
    });

    // Set up email data
    let mailOptions = {
        from: `"${name}" <${email}>`, // Sender address (shows user's name and email)
        to: process.env.EMAIL_USER, // Your receiving email address
        subject: `New Message from Portfolio Contact Form from ${name}`,
        text: `You have received a new message.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h3>You have received a new message.</h3>
               <p><b>Name:</b> ${name}</p>
               <p><b>Email:</b> ${email}</p>
               <p><b>Message:</b></p>
               <p>${message}</p>`,
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
        }
        console.log('Message sent: %s', info.messageId);
        return res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});