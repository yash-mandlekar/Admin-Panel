const nodemailer = require("nodemailer");
const googleApis = require("googleapis");

const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const authClient = new googleApis.google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
authClient.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.mailer = async (user) => {
  try {
    const ACCESS_TOKEN = await authClient.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "lokdeshtv@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
      },
    });

    const details = {
      from: "lokdeshtv@gmail.com",
      to: user.email,
      subject: user.subject,
      text: user.message,
    };

    const result = await transport.sendMail(details);
    return result;
  } catch (err) {
    return err;
  }
};
