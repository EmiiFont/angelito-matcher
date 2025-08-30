import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export class EmailService {
  private mailerSend: MailerSend;
  private fromEmail: string;
  private fromName: string;

  constructor(config: EmailConfig) {
    this.mailerSend = new MailerSend({
      apiKey: config.apiKey,
    });
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    const sentFrom = new Sender(this.fromEmail, this.fromName);
    const recipients = [new Recipient(emailData.to, emailData.toName || emailData.to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(emailData.subject);

    if (emailData.html) {
      emailParams.setHtml(emailData.html);
    }

    if (emailData.text) {
      emailParams.setText(emailData.text);
    }

    if (emailData.replyTo) {
      emailParams.setReplyTo(new Sender(emailData.replyTo, this.fromName));
    }

    await this.mailerSend.email.send(emailParams);
  }

  async sendBulkEmail(recipients: Array<{ email: string; name?: string }>, subject: string, html?: string, text?: string): Promise<void> {
    const sentFrom = new Sender(this.fromEmail, this.fromName);
    const recipientList = recipients.map(r => new Recipient(r.email, r.name || r.email));

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipientList)
      .setSubject(subject);

    if (html) {
      emailParams.setHtml(html);
    }

    if (text) {
      emailParams.setText(text);
    }

    await this.mailerSend.email.send(emailParams);
  }
}

export function createEmailService(env: { MAILERSEND_API_KEY?: string; FROM_EMAIL?: string; FROM_NAME?: string }): EmailService {
  if (!env.MAILERSEND_API_KEY) {
    throw new Error("MAILERSEND_API_KEY environment variable is required");
  }
  
  if (!env.FROM_EMAIL) {
    throw new Error("FROM_EMAIL environment variable is required");
  }

  return new EmailService({
    apiKey: env.MAILERSEND_API_KEY,
    fromEmail: env.FROM_EMAIL,
    fromName: env.FROM_NAME || "Angelito Matcher",
  });
}