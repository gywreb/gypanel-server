const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const Product = require("../database/models/Product");

exports.EmailService = class EmailService {
  static init() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    return this;
  }

  static async sendInvoiceEmail(email, subject, message, invoice, next) {
    try {
      this.transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extname: "handlebars",
            layoutsDir: "views/",
            defaultLayout: "index",
          },
          viewPath: "views/",
        })
      );
      return await this.transporter.sendMail({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject,
        text: message,
        template: "index",
        context: {
          items: invoice.productList.map((product) => {
            const { name, quantity, price } = product;
            return { name, quantity, price };
          }),
          total: invoice.total,
        },
      });
    } catch (error) {
      next(error);
    }
  }
};
