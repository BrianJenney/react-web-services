const nodemailer = require("nodemailer");
const config = require("../config.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.gmail_name,
        pass: config.gmail_pw
    }
});

class Mailer {
    constructor(recipient, sender, subject, html, res) {
        this.recipient = recipient;
        this.sender = sender;
        this.subject = subject;
        this.html = html;
        this.res = res;
        this.transporter = transporter;
    }

    sendMail() {
        const mailOptions = {
            from: this.sender,
            to: this.recipient,
            subject: this.subject,
            html: this.html
        };

        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                this.res.json(err);
            } else {
                this.res.json({ ok: 200 });
            }
        });
    }
}

module.exports = Mailer;
