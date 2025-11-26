import nodemailer from 'nodemailer';
import { clientConfirmationTemplate, adminNotificationTemplate } from './templates/email-templates.mjs';

// Create reusable transporter using Titan SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env['TITAN_EMAIL'] || 'gt@guytagger.com',
    pass: process.env['TITAN_PASSWORD']
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contactName, contactEmail, contactPhone, message } = req.body;

    // Validate required fields
    if (!contactEmail && !contactName) {
      return res.status(400).json({ 
        error: 'At least name or email is required' 
      });
    }

    // Validate email format if provided
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    const adminEmail = 'gt@guytagger.com';

    // Send confirmation email to client (if email provided)
    let clientEmailId = null;
    if (contactEmail) {
      const clientEmailInfo = await transporter.sendMail({
        from: '"Guy Tagger" <gt@guytagger.com>',
        to: contactEmail,
        subject: 'Thank you for reaching out!',
        html: clientConfirmationTemplate({
          name: contactName || 'there',
          message: message
        })
      });
      clientEmailId = clientEmailInfo.messageId;
    }

    // Send notification email to admin
    const adminEmailInfo = await transporter.sendMail({
      from: '"Portfolio Contact Form" <gt@guytagger.com>',
      to: adminEmail,
      subject: `New Contact Form Submission from ${contactName || contactEmail}`,
      html: adminNotificationTemplate({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: message,
        submittedAt: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short'
        })
      })
    });

    return res.status(200).json({ 
      success: true,
      message: 'Emails sent successfully',
      clientEmailId: clientEmailId,
      adminEmailId: adminEmailInfo.messageId
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    
    // Detailed error logging
    const errorDetails = {
      message: error.message || 'Unknown error',
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    };
    
    console.error('Detailed error:', errorDetails);
    
    return res.status(500).json({ 
      error: 'Failed to send emails',
      details: error.message || 'Unknown error occurred',
      debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    });
  }
}

