// SMS service configuration using Twilio
export interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export interface SMSTemplate {
  message: string;
}

// SMS templates
export const smsTemplates = {
  verification: (otp: string): SMSTemplate => ({
    message: `Your Trade Crafter verification code is: ${otp}. Valid for 10 minutes.`
  }),
  
  login: (otp: string): SMSTemplate => ({
    message: `Your Trade Crafter login code is: ${otp}. Valid for 10 minutes.`
  })
};

// Get SMS configuration from environment variables
export const getSMSConfig = (): SMSConfig => ({
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || ''
});

// Check if SMS is configured
export const isSMSConfigured = (): boolean => {
  const config = getSMSConfig();
  return !!(config.accountSid && config.authToken && config.fromNumber);
};

// Mock SMS service for development
export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  const config = getSMSConfig();
  
  if (!isSMSConfigured()) {
    // In development, just log the SMS
    console.log(`📱 SMS to ${to}: ${message}`);
    return true;
  }

  try {
    // In production, you would use Twilio SDK here
    // const client = require('twilio')(config.accountSid, config.authToken);
    // await client.messages.create({
    //   body: message,
    //   from: config.fromNumber,
    //   to: to
    // });
    
    console.log(`📱 SMS sent to ${to}: ${message}`);
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}; 