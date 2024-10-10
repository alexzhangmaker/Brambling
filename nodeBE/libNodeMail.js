const nodemailer = require("nodemailer");


//refer https://mailtrap.io/blog/nodemailer-gmail/
//important: detn gajd kexo zeoj


  
// Configure the mailoptions object
const mailOptions = {
    from: 'alexszhang@gmail.com',
    to: 'alexszhang@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};


function _sendMail(jsonMail){
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use false for STARTTLS; true for SSL on port 465
        auth: {
            user: 'alexszhang@gmail.com',
            pass: 'detngajdkexozeoj'
        }
    });

    // Send the email
    transporter.sendMail(jsonMail, function(error, info){
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}

exports.sendGoogleMail                     = _sendMail ;
