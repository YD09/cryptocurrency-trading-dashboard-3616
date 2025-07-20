// Notification service for trading signals
import { sendEmail } from './email';

export interface TradingSignal {
  id: string;
  strategyId: string;
  strategyName: string;
  symbol: string;
  signal: 'BUY' | 'SELL';
  price: number;
  timestamp: Date;
  userEmail: string;
}

export interface SignalNotification {
  strategyName: string;
  symbol: string;
  signal: 'BUY' | 'SELL';
  price: number;
  timestamp: Date;
  userEmail: string;
}

// Send trading signal notification via email
export const sendTradingSignalNotification = async (signal: SignalNotification): Promise<boolean> => {
  try {
    const subject = `🚨 Trading Signal: ${signal.signal} ${signal.symbol}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: ${signal.signal === 'BUY' ? '#d4edda' : '#f8d7da'}; border: 1px solid ${signal.signal === 'BUY' ? '#c3e6cb' : '#f5c6cb'}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: ${signal.signal === 'BUY' ? '#155724' : '#721c24'}; margin: 0 0 10px 0;">
            ${signal.signal === 'BUY' ? '🟢 BUY' : '🔴 SELL'} Signal Triggered
          </h2>
          <p style="margin: 0; color: ${signal.signal === 'BUY' ? '#155724' : '#721c24'}; font-size: 16px;">
            Your strategy "${signal.strategyName}" has detected a ${signal.signal} signal for ${signal.symbol}
          </p>
        </div>
        
        <div style="background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #333; margin: 0 0 15px 0;">Signal Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Strategy:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${signal.strategyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Symbol:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${signal.symbol}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Signal:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: ${signal.signal === 'BUY' ? '#28a745' : '#dc3545'}; font-weight: bold;">${signal.signal}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Price:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">$${signal.price.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Time:</td>
              <td style="padding: 8px 0;">${signal.timestamp.toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; font-size: 14px; color: #6c757d;">
          <p style="margin: 0;">
            <strong>Disclaimer:</strong> This is an automated trading signal. Please do your own research and consider your risk tolerance before making any trading decisions.
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #6c757d;">
          <p style="margin: 0;">
            Sent from Trade Crafter - Your AI Trading Assistant
          </p>
        </div>
      </div>
    `;
    
    const text = `
Trading Signal Alert

${signal.signal} Signal for ${signal.symbol}
Strategy: ${signal.strategyName}
Price: $${signal.price.toFixed(2)}
Time: ${signal.timestamp.toLocaleString()}

Disclaimer: This is an automated trading signal. Please do your own research before trading.

Sent from Trade Crafter
    `;

    return await sendEmail(signal.userEmail, subject, html, text);
  } catch (error) {
    console.error('Error sending trading signal notification:', error);
    return false;
  }
};

// Simulate signal generation (for development)
export const simulateSignal = async (strategy: any, userEmail: string): Promise<void> => {
  const signal: SignalNotification = {
    strategyName: strategy.name,
    symbol: strategy.symbol,
    signal: Math.random() > 0.5 ? 'BUY' : 'SELL',
    price: Math.random() * 1000 + 100,
    timestamp: new Date(),
    userEmail: userEmail
  };

  console.log('🎯 Simulating trading signal:', signal);
  await sendTradingSignalNotification(signal);
};

// Check for signals and send notifications
export const checkAndSendSignals = async (strategies: any[], userEmail: string): Promise<void> => {
  for (const strategy of strategies) {
    if (strategy.enabled) {
      // Simulate signal generation (in real app, this would check market conditions)
      if (Math.random() < 0.1) { // 10% chance of signal
        await simulateSignal(strategy, userEmail);
      }
    }
  }
}; 