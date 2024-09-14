const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  //  createdAt: { type: Date, default: Date.now, expires: '5m' } // OTP expires in 5 minutes
});

const OTP = mongoose.model('OTP', otpSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'img_2023017@iiitm.ac.in', // Your email
    pass: 'svd74food'                // Your email password
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: 'img_2023017@iiitm.ac.in',  // Sender address
    to: email,                        // Recipient email address
    subject: 'Your OTP Code',         // Subject line
    text: `Your OTP code is ${otp}`,  // Plain text body
    html: `<b>Your OTP code is ${otp}</b>`  // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}




async function saveOtpToDatabase(email, otp) {
  const existingOtp = await OTP.findOne({ email });

  if (existingOtp) {
    existingOtp.otp = otp;
    existingOtp.createdAt = Date.now(); 
    await existingOtp.save();
  } else {
    const newOtp = new OTP({ email, otp });
    await newOtp.save();
  }
}



async function sendaboutEmail(name, email, message) {
  const mailOptions = {
    from: email,  // Sender address
    to: 'img_2023017@iiitm.ac.in',  // Recipient email address
    subject: `Contact form submission from ${name}`,  // Subject line
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,  // Plain text body
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`  // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}




sendaboutEmail("chayan das","daschayan8837@gmail.com","massage is nothing")

module.exports = {
  generateOTP,
  sendOtpEmail,
  saveOtpToDatabase,
  sendaboutEmail,
  OTP 
};
