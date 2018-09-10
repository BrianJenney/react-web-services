const nodemailer = require("nodemailer");
const config = require("../config.js");
const ENV = process.env.NODE_ENV ? "PROD" : "DEV";
const DEV_TEAM = "brianjenney83@gmail.com";

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
            to: ENV === "PROD" ? this.recipient : DEV_TEAM,
            subject: this.subject,
            html: this.html
        };

        this.transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                this.res.json(err);
            } else {
                this.res.json({ ok: 200 });
            }
        });
    }
}

module.exports = Mailer;
