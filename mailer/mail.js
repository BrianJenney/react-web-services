const nodemailer = require("nodemailer");
const gmail_name = process.env.NODE_ENV
    ? process.env.gmail_name
    : require("../config.js").gmail_name;
const gmail_pw = process.env.NODE_ENV
    ? process.env.gmail_pw
    : require("../config.js").gmail_pw;
const ENV = process.env.NODE_ENV ? "PROD" : "DEV";
const DEV_TEAM = "brianjenney83@gmail.com";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmail_name,
        pass: gmail_pw
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
