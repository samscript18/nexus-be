export default () => ({
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT,
  mailerUser: process.env.MAILER_USER,
  mailerPassword: process.env.MAILER_PASSWORD,
  paymentApiUrl: process.env.PAYMENT_API_URL,
  paymentApiKey: process.env.PAYMENT_API_KEY,
});
