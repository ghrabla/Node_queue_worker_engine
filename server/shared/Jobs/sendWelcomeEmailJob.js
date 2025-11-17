const nodemailer = require("nodemailer");

module.exports = async (job) => {
  const { email } = job.data;

  const transporter = nodemailer.createTransport({
    jsonTransport: true,
  });

  await transporter.sendMail({
    from: "no-reply@solo.com",
    to: email,
    subject: "Welcome!",
    text: "Welcome to Solo!",
  });

  console.log("Email sent to:", email);
};
