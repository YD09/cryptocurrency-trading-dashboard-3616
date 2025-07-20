// Email service configuration
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Email templates
export const emailTemplates = {
  verification: (email: string, token: string): EmailTemplate => ({
    subject: 'Verify your Trade Crafter account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8989DE;">Welcome to Trade Crafter!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${window.location.origin}/verify?token=${token}&email=${email}" 
           style="background-color: #8989DE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${window.location.origin}/verify?token=${token}&email=${email}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
    text: `Welcome to Trade Crafter! Please verify your email by visiting: ${window.location.origin}/verify?token=${token}&email=${email}`
  }),
  
  passwordReset: (email: string, token: string): EmailTemplate => ({
    subject: 'Reset your Trade Crafter password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8989DE;">Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${window.location.origin}/reset-password?token=${token}&email=${email}" 
           style="background-color: #8989DE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Reset your password by visiting: ${window.location.origin}/reset-password?token=${token}&email=${email}`
  })
};

// Get email configuration from environment variables
export const getEmailConfig = (): EmailConfig => ({
  host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: import.meta.env.VITE_SMTP_USER || '',
    pass: import.meta.env.VITE_SMTP_PASS || ''
  }
});

// Check if email is configured
export const isEmailConfigured = (): boolean => {
  const config = getEmailConfig();
  return !!(config.auth.user && config.auth.pass);
};

// Send email function
export const sendEmail = async (to: string, subject: string, html: string, text: string): Promise<boolean> => {
  const config = getEmailConfig();
  
  if (!isEmailConfigured()) {
    // In development, just log the email
    console.log(`📧 Email to ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text}`);
    return true;
  }

  try {
    // In production, you would use a proper email service here
    // For now, we'll just log it in development
    console.log(`📧 Email sent to ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}; 