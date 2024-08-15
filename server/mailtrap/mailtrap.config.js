import {MailtrapClient} from 'mailtrap'
import env from 'dotenv'
env.config()

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

export const mailTrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

