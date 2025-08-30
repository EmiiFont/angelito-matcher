import Twilio from "twilio";

export interface MessagingConfig {
  accountSid: string;
  authToken: string;
  fromPhoneNumber: string;
  whatsappFromNumber?: string;
}

export interface SMSData {
  to: string;
  body: string;
  mediaUrl?: string[];
}

export interface WhatsAppData {
  to: string;
  body: string;
  mediaUrl?: string[];
}

export class MessagingService {
  private client: Twilio.Twilio;
  private fromPhoneNumber: string;
  private whatsappFromNumber: string;

  constructor(config: MessagingConfig) {
    this.client = Twilio(config.accountSid, config.authToken);
    this.fromPhoneNumber = config.fromPhoneNumber;
    this.whatsappFromNumber = config.whatsappFromNumber || config.fromPhoneNumber;
  }

  async sendSMS(smsData: SMSData): Promise<string> {
    const message = await this.client.messages.create({
      body: smsData.body,
      from: this.fromPhoneNumber,
      to: smsData.to,
      mediaUrl: smsData.mediaUrl,
    });

    return message.sid;
  }

  async sendWhatsApp(whatsappData: WhatsAppData): Promise<string> {
    const message = await this.client.messages.create({
      body: whatsappData.body,
      from: `whatsapp:${this.whatsappFromNumber}`,
      to: `whatsapp:${whatsappData.to}`,
      mediaUrl: whatsappData.mediaUrl,
    });

    return message.sid;
  }

  async sendBulkSMS(recipients: string[], body: string, mediaUrl?: string[]): Promise<string[]> {
    const promises = recipients.map(to =>
      this.client.messages.create({
        body,
        from: this.fromPhoneNumber,
        to,
        mediaUrl,
      })
    );

    const messages = await Promise.all(promises);
    return messages.map(message => message.sid);
  }

  async sendBulkWhatsApp(recipients: string[], body: string, mediaUrl?: string[]): Promise<string[]> {
    const promises = recipients.map(to =>
      this.client.messages.create({
        body,
        from: `whatsapp:${this.whatsappFromNumber}`,
        to: `whatsapp:${to}`,
        mediaUrl,
      })
    );

    const messages = await Promise.all(promises);
    return messages.map(message => message.sid);
  }

  async getMessageStatus(messageSid: string): Promise<string> {
    const message = await this.client.messages(messageSid).fetch();
    return message.status;
  }
}

export function createMessagingService(env: { 
  TWILIO_ACCOUNT_SID?: string; 
  TWILIO_AUTH_TOKEN?: string; 
  TWILIO_PHONE_NUMBER?: string;
  TWILIO_WHATSAPP_NUMBER?: string;
}): MessagingService {
  if (!env.TWILIO_ACCOUNT_SID) {
    throw new Error("TWILIO_ACCOUNT_SID environment variable is required");
  }
  
  if (!env.TWILIO_AUTH_TOKEN) {
    throw new Error("TWILIO_AUTH_TOKEN environment variable is required");
  }

  if (!env.TWILIO_PHONE_NUMBER) {
    throw new Error("TWILIO_PHONE_NUMBER environment variable is required");
  }

  return new MessagingService({
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    fromPhoneNumber: env.TWILIO_PHONE_NUMBER,
    whatsappFromNumber: env.TWILIO_WHATSAPP_NUMBER,
  });
}
