/**
 * Client Confirmation Email Template
 * Sent to the client who submitted the contact form
 * @param {Object} data - Template data
 * @param {string} data.name - Client name
 * @param {string} data.message - Client message
 * @returns {string} HTML email template
 */
export function clientConfirmationTemplate(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
      color: #1f2937;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #111827;
    }
    .message-box {
      background-color: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .message-label {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
      color: #667eea;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .message-text {
      color: #4b5563;
      line-height: 1.6;
      margin: 0;
      white-space: pre-line;
    }
    .response-time {
      background-color: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 15px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    }
    .response-time p {
      margin: 0;
      color: #1e40af;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
      color: #6b7280;
      font-size: 14px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <h1>Thank You! 🎉</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hi ${data.name},</p>
      
      <p>Thank you for reaching out! I've received your inquiry and I'm excited to learn more about your project.</p>

      <!-- Message Summary -->
      <div class="message-box">
        <div class="message-label">Your Message:</div>
        <p class="message-text">${data.message}</p>
      </div>

      <!-- Response Time -->
      <div class="response-time">
        <p><strong>⏱️ I typically respond within 24 hours</strong></p>
      </div>

      <p>In the meantime, feel free to check out my portfolio to see some of my recent work and case studies.</p>

      <div class="divider"></div>

      <p>Looking forward to connecting with you soon!</p>
      <p style="margin-top: 20px;">
        <strong>Best regards,</strong><br>
        Guy Tagger<br>
        <span style="color: #667eea;">Full-Stack Developer & Designer</span>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Guy Tagger</strong></p>
      <p>gt@guytagger.com</p>
      <div class="social-links">
        <a href="https://guytagger.com">Portfolio</a>
        <a href="https://github.com/guytagger">GitHub</a>
        <a href="https://linkedin.com/in/guytagger">LinkedIn</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        This email was sent because you submitted a contact form at guytagger.com
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Admin Notification Email Template
 * Sent to gt@guytagger.com when someone submits the contact form
 * @param {Object} data - Template data
 * @param {string} data.name - Client name
 * @param {string} data.email - Client email
 * @param {string} data.phone - Client phone
 * @param {string} data.message - Client message
 * @param {string} data.submittedAt - Submission timestamp
 * @returns {string} HTML email template
 */
export function adminNotificationTemplate(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
    }
    .email-wrapper {
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }
    .alert-badge {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px;
    }
    .info-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
      min-width: 100px;
      font-size: 14px;
    }
    .info-value {
      color: #1f2937;
      flex: 1;
      font-size: 14px;
    }
    .info-value a {
      color: #667eea;
      text-decoration: none;
    }
    .message-section {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .message-label {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
      color: #d97706;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .message-text {
      color: #78350f;
      line-height: 1.6;
      margin: 0;
      white-space: pre-line;
      font-size: 14px;
    }
    .action-buttons {
      margin: 30px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin: 0 5px;
    }
    .timestamp {
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .quick-stats {
      display: flex;
      justify-content: space-around;
      margin: 25px 0;
      padding: 20px;
      background-color: #f0fdf4;
      border-radius: 8px;
    }
    .stat {
      text-align: center;
    }
    .stat-label {
      font-size: 12px;
      color: #166534;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 18px;
      color: #15803d;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="alert-badge">🔔 New Inquiry</div>
      <h1>Contact Form Submission</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p style="font-size: 16px; color: #1f2937; margin-bottom: 20px;">
        You have received a new inquiry from your portfolio contact form.
      </p>

      <!-- Contact Information -->
      <div class="info-card">
        <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">Contact Information</h3>
        
        ${data.name ? `
        <div class="info-row">
          <div class="info-label">Name:</div>
          <div class="info-value"><strong>${data.name}</strong></div>
        </div>
        ` : ''}
        
        ${data.email ? `
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value">
            <a href="mailto:${data.email}">${data.email}</a>
          </div>
        </div>
        ` : ''}
        
        ${data.phone ? `
        <div class="info-row">
          <div class="info-label">Phone:</div>
          <div class="info-value">
            <a href="tel:${data.phone}">${data.phone}</a>
          </div>
        </div>
        ` : '<div class="info-row"><div class="info-label">Phone:</div><div class="info-value" style="color: #9ca3af;">Not provided</div></div>'}
      </div>

      <!-- Message -->
      <div class="message-section">
        <div class="message-label">📝 Inquiry Message:</div>
        <p class="message-text">${data.message}</p>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat">
          <div class="stat-label">Priority</div>
          <div class="stat-value">High</div>
        </div>
        <div class="stat">
          <div class="stat-label">Response Time</div>
          <div class="stat-value">24h</div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        ${data.email ? `<a href="mailto:${data.email}?subject=Re: Your inquiry" class="btn">Reply via Email</a>` : ''}
        ${data.phone ? `<a href="tel:${data.phone}" class="btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">Call</a>` : ''}
      </div>

      <!-- Timestamp -->
      <div class="timestamp">
        📅 Submitted on ${data.submittedAt}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

