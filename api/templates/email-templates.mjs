/**
 * Parse message to extract project description and project types
 * @param {string} message - The message string
 * @returns {Object} Parsed data with projectDescription and projectType
 */
function parseMessage(message) {
  if (!message) return { projectDescription: '', projectType: '' };
  
  const projectDescMatch = message.match(/Project Description:\s*(.+?)(?:\n\n|$)/i);
  const projectTypeMatch = message.match(/Project Type\(s\):\s*(.+?)(?:\n\n|$)/i);
  
  return {
    projectDescription: projectDescMatch ? projectDescMatch[1].trim() : '',
    projectType: projectTypeMatch ? projectTypeMatch[1].trim() : ''
  };
}

/**
 * Client Confirmation Email Template
 * Sent to the client who submitted the contact form
 * @param {Object} data - Template data
 * @param {string} data.name - Client name
 * @param {string} data.email - Client email
 * @param {string} data.phone - Client phone
 * @param {string} data.message - Client message
 * @returns {string} HTML email template
 */
export function clientConfirmationTemplate(data) {
  const parsed = parseMessage(data.message || '');
  const projectDescription = parsed.projectDescription || data.projectDescription || '';
  const projectType = parsed.projectType || data.projectType || '';
  const calenderUrl = "https://calendly.com/guytagger";
  const url = "https://www.guytagger.com";
  const oldUrl = "https://e2e-portfolio.vercel.app";
  
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
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 24px auto;
      background-color: #ffffff;
      border: 1px solid #c7c7c7;
    }
    .header {
      background-color: #141313;
      padding: 32px 16px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 81px;
      margin-bottom: 16px;
    }
    .logo {
      width: 88px;
      height: 81px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    .header h1 {
      margin: 0;
      color: #fcfcfc;
      font-size: 34px;
      font-weight: 500;
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
      text-shadow: rgba(252, 252, 252, 0.5) 0px 0px 10px;
      letter-spacing: -1.36px;
    }
    .content {
      padding: 24px 24px 48px;
      color: #141313;
    }
    .greeting {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 16px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .intro-text {
      font-size: 18px;
      line-height: 1.6;
      color: #141313;
      margin-bottom: 8px;
      font-family: 'Roboto', sans-serif;
    }
    .details-section {
      margin: 24px 0;
    }
    .details-label {
      font-size: 18px;
      color: #141313;
      margin-bottom: 24px;
      font-family: 'Roboto', sans-serif;
    }
    .details-box {
      background-color: #fafafa;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .detail-row {
      display: flex;
      gap: 12px;
      padding: 16px 0 0;
      border-top: 1px solid #d5d5d5;
      font-size: 14px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .detail-row:first-child {
      border-top: none;
      padding-top: 0;
    }
    .detail-label {
      font-weight: 500;
      font-family: 'Roboto', sans-serif;
    }
    .detail-value {
      font-weight: 300;
      font-style: italic;
      font-family: 'Roboto', sans-serif;
    }
    .process-section {
      margin: 48px 0;
    }
    .process-intro {
      font-size: 18px;
      color: #141313;
      margin-bottom: 24px;
      font-family: 'Roboto', sans-serif;
    }
    .process-step {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-start;
    }
    .step-icon {
      width: 40px;
      height: 40px;
      background-color: #BE121E;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    .step-icon svg {
      width: 25px;
      height: 25px;
      fill: #fcfcfc;
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-size: 18px;
      font-weight: 700;
      color: #141313;
      margin-bottom: 8px;
      font-family: 'Roboto', sans-serif;
    }
    .step-description {
      font-size: 16px;
      line-height: 1.6;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .cta-section {
      margin: 24px 0;
    }
    .cta-text {
      font-size: 18px;
      color: #141313;
      margin-bottom: 16px;
      font-family: 'Roboto', sans-serif;
    }
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(229deg, #EA624A -15.19%, #961416 73.3%);
      color: #fcfcfc;
      padding: 12px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      font-family: 'Geist', sans-serif;
      border: 0.5px solid #df563e;
    }
    .cta-button svg {
      width: 25px;
      height: 25px;
      fill: #fcfcfc;
    }
    .closing-section {
      margin: 48px 0;
    }
    .closing-text {
      font-size: 18px;
      color: #141313;
      margin-bottom: 48px;
      font-family: 'Roboto', sans-serif;
    }
    .signature {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 48px;
    }
    .signature-line {
      font-size: 18px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .contact-links {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      margin-bottom: 48px;
      font-family: 'Roboto', sans-serif;
    }
    .contact-link {
     background: linear-gradient(229deg, #EA624A -15.19%, #961416 73.3%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
    }
    .contact-link.underline {
      text-decoration: underline;
    }
    .social-icons {
      display: flex;
      gap: 24px;
      justify-content: center;
      margin-bottom: 48px;
    }
    .social-icon {
      width: 18px;
      height: 18px;
      opacity: 0.7;
    }
    .footer {
      text-align: center;
      padding-bottom: 52px;
    }
    .copyright {
      font-size: 12px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 24px 48px;
      }
      .header h1 {
        font-size: 26px;
        letter-spacing: -1.04px;
      }
      .logo-container {
        height: 55.711px;
      }
      .logo {
        width: 60px;
        height: 55.711px;
      }
      .greeting {
        font-size: 18px;
      }
      .intro-text {
        font-size: 16px;
      }
      .process-intro {
        font-size: 16px;
      }
      .step-icon {
        width: 25px;
        height: 25px;
      }
      .step-icon svg {
        width: 15.625px;
        height: 15.625px;
      }
      .step-title {
        font-size: 16px;
      }
      .step-description {
        font-size: 16px;
      }
      .cta-text {
        font-size: 16px;
      }
      .closing-text {
        font-size: 16px;
      }
      .signature-line {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="logo-container">
        <div class="logo">
          <img src="${oldUrl}/assets/images/icons/logo-symbol.webp" alt="Guy Tagger Logo" width="88" height="81" style="display: block; max-width: 100%; height: auto;">
        </div>
      </div>
      <h1>Great to meet you!</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${data.name || '[Name]'}</p>
      
      <div class="intro-text">
        <p>Thank you so much for getting in touch through my portfolio website! I'm excited to hear that you're interested in working together.</p>
        <p>Here are the details we received:</p>
      </div>

      <!-- Details Section -->
      <div class="details-section">
        <div class="details-box">
          ${data.name ? `
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${data.name}</span>
          </div>
          ` : ''}
          ${data.email ? `
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${data.email}</span>
          </div>
          ` : ''}
          ${data.phone ? `
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${data.phone}</span>
          </div>
          ` : ''}
          ${projectDescription ? `
          <div class="detail-row">
            <span class="detail-label">Project Description:</span>
            <span class="detail-value">${projectDescription}</span>
          </div>
          ` : ''}
          ${projectType ? `
          <div class="detail-row">
            <span class="detail-label">Project Type(s):</span>
            <span class="detail-value">${projectType}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <p class="process-intro">I'm thrilled about the opportunity to collaborate with you. Here's how we can make it happen:</p>

      <!-- Process Steps -->
      <div class="process-section">
        <div class="process-step">
          <div class="step-icon">
           <img src="${oldUrl}/assets/images/icons/chat-bubbles.svg" alt="Chat Icon" width="24" height="24">
          </div>
          <div class="step-content">
            <div class="step-title">Let's Chat!</div>
            <div class="step-description">We'll start with an initial consultation to discuss your needs, understand your vision, and map out the project.</div>
          </div>
        </div>
        <div class="process-step">
          <div class="step-icon">
           <img src="${oldUrl}/assets/images/icons/document.svg" alt="Proposal Icon" width="24" height="24">
          </div>
          <div class="step-content">
            <div class="step-title">Proposal Time:</div>
            <div class="step-description">After our chat, I'll send you a detailed proposal and quote tailored to your specific requirements.</div>
          </div>
        </div>
        <div class="process-step">
          <div class="step-icon">
            <img src="${oldUrl}/assets/images/icons/verify.svg" alt="verify Icon" width="24" height="24">
          </div>
          <div class="step-content">
            <div class="step-title">Getting to Work:</div>
            <div class="step-description">Once the proposal is approved, I'll dive into the project, keeping you updated every step of the way.</div>
          </div>
        </div>
        <div class="process-step">
          <div class="step-icon">
           <img src="${oldUrl}/assets/images/icons/like.svg" alt="like Icon" width="24" height="24">
          </div>
          <div class="step-content">
            <div class="step-title">Your Feedback Matters:</div>
            <div class="step-description">I'll regularly seek your input to make sure everything aligns with your expectations.</div>
          </div>
        </div>
        <div class="process-step">
          <div class="step-icon">
           <img src="${oldUrl}/assets/images/icons/happy.svg" alt="happy smile Icon" width="24" height="24">
          </div>
          <div class="step-content">
            <div class="step-title">Final Touches:</div>
            <div class="step-description">When you are happy with the results, I'll deliver the final product, ready to impress!</div>
          </div>
        </div>
      </div>

      <p class="cta-text">Ready to start? Schedule a free consultation using the link below:</p>

      <!-- CTA Button -->
      <div class="cta-section">
        <a href="${calenderUrl}" class="cta-button">
          Schedule a Call with Me
         <img src="${oldUrl}/assets/images/icons/calendar-add.svg" alt="Calendar Icon" width="25" height="25">
        </a>
      </div>

      <!-- Closing -->
      <div class="closing-section">
        <p class="closing-text">Looking forward to creating something awesome together!</p>
        
        <div class="signature">
          <p class="signature-line">Best,</p>
          <p class="signature-line">Guy Tagger</p>
          <div class="contact-links">
            <a href="https://guytagger.com" class="contact-link">guytagger.com</a>
            <a href="mailto:gt@guytagger.com" class="contact-link underline">gt@guytagger.com</a>
          </div>
        </div>

        <!-- Social Icons -->
        <div class="social-icons">
          <a href="https://www.linkedin.com/in/guytagger/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon">
            <img src="${oldUrl}/assets/images/icons/linkedin-gray.svg" alt="LinkedIn Icon" width="25" height="25">
          </a>
          <a href="https://github.com/bsod700" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="social-icon">
            <img src="${oldUrl}/assets/images/icons/github-gray.svg.svg" alt="GitHub Icon" width="25" height="25">
          </a>
          <a href="https://slack.com/app_redirect?channel=U0943JCBDPG" target="_blank" rel="noopener noreferrer" aria-label="Slack" class="social-icon">
            <img src="${oldUrl}/assets/images/icons/slack-gray.svg" alt="Website Icon" width="25" height="25">
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="copyright">© 2025 Guy Tagger Portfolio. All rights reserved.</p>
      </div>
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
  const parsed = parseMessage(data.message || '');
  const projectDescription = parsed.projectDescription || data.projectDescription || '';
  const projectType = parsed.projectType || data.projectType || '';
  const calenderUrl = "https://calendly.com/guytagger";
  const url = "https://www.guytagger.com";
  const oldUrl = "https://e2e-portfolio.vercel.app/";
  
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
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f4f5;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 24px auto;
      background-color: #ffffff;
      border: 1px solid #c7c7c7;
    }
    .header {
      background-color: #141313;
      padding: 32px 16px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 81px;
      margin-bottom: 16px;
    }
    .logo {
      width: 88px;
      height: 81px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
    }
    .header h1 {
      margin: 0;
      color: #fcfcfc;
      font-size: 34px;
      font-weight: 500;
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
      text-shadow: rgba(252, 252, 252, 0.5) 0px 0px 10px;
      letter-spacing: -1.36px;
    }
    .content {
      padding: 24px 24px 48px;
      color: #141313;
    }
    .greeting {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 16px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .intro-text {
      font-size: 18px;
      line-height: 1.6;
      color: #141313;
      margin-bottom: 8px;
      font-family: 'Roboto', sans-serif;
    }
    .details-section {
      margin: 24px 0;
    }
    .details-label {
      font-size: 18px;
      color: #141313;
      margin-bottom: 24px;
      font-family: 'Roboto', sans-serif;
    }
    .details-box {
      background-color: #fafafa;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .detail-row {
      display: flex;
      gap: 12px;
      padding: 16px 0 0;
      border-top: 1px solid #d5d5d5;
      font-size: 14px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .detail-row:first-child {
      border-top: none;
      padding-top: 0;
    }
    .detail-label {
      font-weight: 500;
      font-family: 'Roboto', sans-serif;
    }
    .detail-value {
      font-weight: 300;
      font-style: italic;
      font-family: 'Roboto', sans-serif;
    }
    .source-info {
      text-align: center;
      margin: 24px 0;
      font-size: 18px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    .source-info strong {
      font-weight: 700;
    }
    .action-section {
      margin: 24px 0;
      text-align: center;
    }
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .action-buttons.horizontal {
      flex-direction: row;
      justify-content: center;
    }
    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(229deg, #EA624A -15.19%, #961416 73.3%);
      color: #fcfcfc;
      padding: 12px 16px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      font-family: 'Geist', sans-serif;
      border: 0.5px solid #df563e;
    }
    .action-button.call {
      background: linear-gradient(229deg, #4A65EA -15.19%, #141F96 73.3%);
      border-color: #3b82f6;
      display: none; /* Hidden on desktop */
    }
    .action-button svg {
      width: 25px;
      height: 25px;
      fill: #fcfcfc;
    }
    .pro-tip {
      text-align: center;
      font-size: 16px;
      font-style: italic;
      color: rgba(20, 19, 19, 0.53);
      font-family: 'Roboto', sans-serif;
      margin-top: 24px;
    }
    .divider {
      border-top: 1px solid #e3e3e3;
      margin: 24px 0;
      padding-top: 24px;
    }
    .timestamp {
      text-align: center;
      font-size: 14px;
      color: rgba(20, 19, 19, 0.53);
      font-family: 'Roboto', sans-serif;
    }
    .footer {
      text-align: center;
      padding-top: 48px;
    }
    .copyright {
      font-size: 12px;
      color: #141313;
      font-family: 'Roboto', sans-serif;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 24px 48px;
      }
      .header h1 {
        font-size: 26px;
        letter-spacing: -1.04px;
      }
      .logo-container {
        height: 55.711px;
      }
      .logo {
        width: 60px;
        height: 55.711px;
      }
      .greeting {
        font-size: 18px;
      }
      .intro-text {
        font-size: 16px;
      }
      .details-label {
        font-size: 16px;
      }
      .source-info {
        font-size: 16px;
      }
      .timestamp {
        font-size: 12px;
      }
      .pro-tip {
        font-size: 14px;
      }
      .action-button.call {
        display: inline-flex; /* Show on mobile */
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="logo-container">
        <div class="logo">
          <img src="${oldUrl}/assets/images/icons/logo-symbol.webp" alt="Guy Tagger Logo" width="88" height="81" style="display: block; max-width: 100%; height: auto;">
        </div>
      </div>
      <h1>New Lead Alert!</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hey Guy</p>
      
      <div class="intro-text">
        <p>You have a new opportunity waiting! Here are the details:</p>
        <p class="details-label">Contact Information:</p>
      </div>

      <!-- Details Section -->
      <div class="details-section">
        <div class="details-box">
          ${data.name ? `
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${data.name}</span>
          </div>
          ` : ''}
          ${data.email ? `
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${data.email}</span>
          </div>
          ` : ''}
          ${data.phone ? `
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${data.phone}</span>
          </div>
          ` : ''}
          ${projectDescription ? `
          <div class="detail-row">
            <span class="detail-label">Project Description:</span>
            <span class="detail-value">${projectDescription}</span>
          </div>
          ` : ''}
          ${projectType ? `
          <div class="detail-row">
            <span class="detail-label">Project Type(s):</span>
            <span class="detail-value">${projectType}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Source Info -->
      <div class="source-info">
        <p><strong>Source</strong>: Portfolio Website</p>
      </div>

      <!-- Action Buttons -->
      <div class="action-section">
        <div class="action-buttons">
          ${data.phone ? `
          <a href="tel:${data.phone}" class="action-button call">
            Call
           <img src="${oldUrl}/assets/images/icons/phone.svg" alt="Phone Icon" width="25" height="25">
          </a>
          ` : ''}
          ${data.email ? `
          <a href="mailto:${data.email}?subject=Re: Your inquiry" class="action-button">
            Reply via Email
           <img src="${oldUrl}/assets/images/icons/email.svg" alt="Email Icon" width="25" height="25">
          </a>
          ` : ''}
        </div>
        <p class="pro-tip">Pro Tip: Speed to lead wins deals. Call them within 5 minutes!</p>
      </div>

      <!-- Divider -->
      <div class="divider">
        <div class="timestamp">
          📅 Submitted on ${data.submittedAt || new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="copyright">© 2025 Guy Tagger Portfolio. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

